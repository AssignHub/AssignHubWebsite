require('dotenv').config()
const TOKEN = process.env.DISCORD_BOT_TOKEN
const Discord = require('discord.js')
const commands = require('./commands')
const client = new Discord.Client()

client.commands = new Discord.Collection()
Object.values(commands).forEach(command => {
  client.commands.set(command.name, command)
})

exports.init = () => {
  client.login(TOKEN)

  client.once('ready', () => {
    console.log(`[DISCORD BOT] Logged in as ${client.user.tag}`)
  })

  client.on('message', msg => {
    if (msg.channel.name === this.getDefaultChannel()) {
      const args = msg.content.split(/ +/)
      const command = args.shift().toLowerCase()
      
      if (!client.commands.has(command)) return
      //console.log(`[DISCORD BOT] Called command: ${command}`)

      try {
        client.commands.get(command).execute(msg, args)
      } catch (err) {
        console.error(`[DISCORD BOT] ${err}`)
        msg.reply('There was an error executing that command!')
      }
    }
  })
}

exports.sendMessageToChannel = (channelName, message) => {
  const channel = client.channels.cache.find(c => c.name === channelName)
  if (channel) {
    channel.send(message)
  } else {
    console.error(`[DISCORD BOT] Channel "${channelName}" does not exist!`)
  }
}

exports.sendMessage = (message) => {
  this.sendMessageToChannel(this.getDefaultChannel(), message)
}

exports.getDefaultChannel = () => {
  if (process.env.NODE_ENV === 'development') {
    return 'assignhub-bot-dev'
  } else {
    return 'assignhub-bot'
  }
}