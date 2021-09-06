const reqlib = require('app-root-path').require
const User = reqlib('models/user')

module.exports = {
  name: '!active_users',
  description: `Gets the number of active users in the database, based on last sign in date. 
  - if LIST is true, it will list the name/email of all users, otherwise, it will only list the number 
  - DAYS is the amount of days since last sign in
  `,
  usage: '!active_users [LIST=false] [DAYS=7]',
  execute: async (msg, args) => {
    let [list=false, days=7] = args
    
    // Convert types
    if (typeof list === 'string')
      list = list === 'true'
    if (typeof days === 'string')
      days = parseInt(days)

    if (args.length > 2) {
      msg.channel.send('Invalid arguments for !active_users')
    }

    let message = 'Active Users\n'
    const query = { lastSignIn: { $gte: new Date().getTime() - days*1000*60*60*24 } }
    const users = await User.find(query).lean()
    message += `Count: ${users.length}\n`
    if (list) {
      for (let { firstName, lastName, email } of users) {
        message += `- ${firstName} ${lastName} (${email})\n`
      }
    }
    msg.channel.send(message)
  },
}