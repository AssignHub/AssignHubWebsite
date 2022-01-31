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

  // Email friend request reminders at 6:11AM UTC every day
  cron.schedule('11 6 * * *', async () => {
    this.emailFriendRequestReminder()
  })

}

exports.resetMood = async () => {
  const morningHour = editJsonFile(`${appRoot}/config/general.json`).toObject()
    .morningHour
  const curUTCHour = new Date().getUTCHours()
  const users = await User.find({
    $expr: {
      $eq: [
        morningHour,
        {
          $subtract: [curUTCHour, { $divide: ['$timezoneOffset', 60] }],
        },
      ],
    },
  })
  users.forEach((user) => {
    user.mood = ''
    user.save()
  })
}

exports.emailFriendRequestReminder = async () => {
  // Current time
  const curr = new Date()

  // Number of days in milliseconds to wait before emailing
  const delayMilli = 1000 *
    60 *
    60 *
    24 *
    editJsonFile(`${appRoot}/config/general.json`).toObject().requestEmailDelay

  // Get all users.
  const users = await User.find()
  for (const user of users) {
    await user
      .populate({
        path: 'outgoingFriendRequests',
        populate: {
          path: 'to',
          select: 'firstName lastName email pic',
        },
      })
      .populate({
        path: 'incomingFriendRequests',
        populate: {
          path: 'from',
          select: 'firstName lastName email pic',
        },
      })
      .execPopulate()
  }

  // Filter for all users that have incoming friend requests.
  const filteredUsers = users
    .filter((user) => user.incomingFriendRequests.length > 0)

  for (const user of filteredUsers) {

      if (!user.lastReminded) {
        // If new user and lastReminded is null

        user.lastReminded = curr.getTime()
        await user.save()
      } else if (curr.getTime() > user.lastReminded.getTime() + delayMilli) {
        // If lastReminded is delayMilli in the past

        user.lastReminded = curr.getTime()
        await user.save()

        if (user.incomingFriendRequests.length == 1) {
          // If user has only one friend request
          const friend = user.incomingFriendRequests[0].from
          mailer.sendMail({
            to: "yytonyxin+AssignHub@gmail.com",
            subject: `${user.email} -> Accept your friend request from ${friend.firstName} ${friend.lastName}!`,
            html: `${friend.firstName} has been waiting 2 days for you to accept their friend request! Head over to <a href="https://assignhub.app">assignhub.app</a> to accept the friend request!`,
          })
        } else {
          // If user has more than one friend request
          mailer.sendMail({
            to: "yytonyxin+AssignHub@gmail.com",
            subject: `${user.email} -> ${user.incomingFriendRequests.length} people are waiting for you to accept their friend requests!`,
            html: `Head over to <a href="https://assignhub.app">assignhub.app</a> to accept your ${user.incomingFriendRequests.length} pending friend requests!`,
          })
        }
      }
    }
}
