const reqlib = require('app-root-path').require
const User = reqlib('models/user')
const commands = require('../commands')

module.exports = {
  name: '!num_users',
  description: 'Gets the number of users in the database. Schools are optional.',
  usage: '!num_users [SCHOOL] [SCHOOL] ...',
  execute: async (msg, args) => {
    let schools
    if (args.length === 0) {
      schools = await User.distinct('school')
    } else {
      schools = args
    }
    let message = 'Number of currently signed up users:'
    for (let school of schools) {
      const numUsers = await User.countDocuments({ school })
      message += `\n${school}: ${numUsers}`
    }
    msg.channel.send(message)
  },
}