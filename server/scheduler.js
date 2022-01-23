const cron = require('node-cron')
const editJsonFile = require('edit-json-file')
const User = require('./models/user')
const FriendRequest = require('./models/friend_request')
const mailer = require('./mailer')
const usc = require('./schools/usc')
const berkeley = require('./schools/berkeley')
const appRoot = require('app-root-path')

exports.scheduleTasks = () => {
  // Set mood to '' if appropriate (checks at the 0th minute every hour)
  cron.schedule('0 * * * *', async () => {
    this.resetMood()
  })

  // Write USC terms to config
  usc.utils.writeTermsToConfig()
  cron.schedule('0 0 * * *', () => {
    usc.utils.writeTermsToConfig()
  })

  // Write Berkeley classes to config
  berkeley.utils.writeClassesToConfig()
  cron.schedule('0 0 * * *', () => {
    berkeley.utils.writeClassesToConfig()
  })

  // email friend request reminder after a certain time period
  /*cron.schedule('11 6 * * *', async () => {
    this.emailFriendRequestReminder()
  })*/
}

exports.resetMood = async () => {
  const morningHour = editJsonFile(`${appRoot}/config/general.json`).toObject().morningHour
  const curUTCHour = new Date().getUTCHours()
  const users = await User.find({
    $expr: {
      $eq: [ 
        morningHour, 
        { 
          $subtract: [
            curUTCHour, 
            { $divide: ['$timezoneOffset', 60] } 
          ] 
        } 
      ],
    },
  })
  users.forEach(user => {
    user.mood = ''
    user.save()
  })
}

exports.emailFriendRequestReminder = async () => {
  const curr = new Date()
  const delayMilli = 1000*60*60*24*editJsonFile(`${appRoot}/config/general.json`).toObject().requestEmailDelay // Number of days to wait before emailing
  const requests = await FriendRequest.find({
    lastReminded: {
      $lt: curr.getTime() - delayMilli
    }
  })

  requests.forEach(request => {
    // mail to each friend from request
    request.lastReminded = curr
    request.save()
    findUser(request.to).then((toUsers) => {
      to = toUsers[0]
      findUser(request.from).then((fromUsers) => {
        from = fromUsers[0]
        mailer.sendMail({
          to: to.email,
          subject: `Accept your friend request from ${from.firstName} ${from.lastName}!`,
          html: `${from.firstName} has been waiting 2 days for you to accept their friend request! Head over to <a href="https://assignhub.app">assignhub.app</a> to accept the friend request!`
        })
      })
    })
    
  })
}

// should move to a utils.js later
findUser = async (userId) => {
  return await User.find({
    $expr: {
      $eq: [
        userId,
        '$_id'
      ]
    }
  })
}