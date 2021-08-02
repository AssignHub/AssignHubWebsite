module.exports = {
  name: '!help',
  description: 'Displays this help message',
  execute: async (msg, args) => {
    const commands = require('../commands')
    let message = ''
    Object.values(commands).forEach(command => {
      message += `\n\n\`${command.name}\`: ${command.description} `
      if (command.usage) {
        message += `Usage: \`${command.usage}\``
      }
    })
    msg.channel.send(message)
  },
}