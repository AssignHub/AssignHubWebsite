const cron = require('node-cron')
const editJsonFile = require('edit-json-file')
const User = require('./models/user')
const usc = require('./schools/usc')

exports.scheduleTasks = () => {
  // Set mood to '' if appropriate (checks at the 0th minute every hour)
  cron.schedule('0 * * * *', async () => {
    const morningHour = editJsonFile(`${__dirname}/../config/general.json`).toObject().morningHour
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
  })

  // Write USC terms to config
  usc.utils.writeTermsToConfig()
  cron.schedule('0 0 * * *', () => {
    usc.utils.writeTermsToConfig()
  })
}
