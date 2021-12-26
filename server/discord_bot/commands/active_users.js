const reqlib = require('app-root-path').require
const DailyUserLog = reqlib('models/daily_user_log')
const User = reqlib('models/user')

module.exports = {
  name: '!active_users',
  description: `Gets the number of active users in the database, based on last sign in date. 
  - if LIST is true, it will list the name/email of all users, otherwise, it will show a bar graph
  - DAYS is the amount of days since last sign in
  `,
  usage: '!active_users [LIST=false] [DAYS=7]',
  execute: async (msg, args) => {
    let [list=false, days=7] = args
    
    // Convert arg types
    if (typeof list === 'string')
      list = list === 'true'
    if (typeof days === 'string')
      days = parseInt(days)

    if (args.length > 2) {
      msg.channel.send('Invalid arguments for !active_users')
    }
    

    // Query for daily user logs starting from `days` days before the current date
    let startDate = new Date(new Date().getTime() - days*1000*60*60*24)
    startDate = `${startDate.toISOString().substring(0, 10)}T00:00:00.000Z`
    const query = { date: { $gte: startDate } }
    const logs = await DailyUserLog.find(query).populate('users', 'firstName lastName email').lean()

    // Add empty days 
    let curDate = new Date(startDate)
    for (let i = logs.length - 1; i >= 0; i--) {
      // Add all dates up to the current log date 
      while (logs[i].date.getTime() != curDate.getTime() && curDate < new Date()) {
        // Insert curDate into logs, with an empty users array
        logs.splice(i+1, 0, { date: curDate, users: [] })
        curDate = new Date(curDate.getTime() + 1000*60*60*24)
      } 

      // Increase curDate by a day
      curDate = new Date(curDate.getTime() + 1000*60*60*24)
    }

    // Add all dates up to the current date
    while (curDate < new Date()) {
      logs.splice(0, 0, { date: curDate, users: [] })
      curDate = new Date(curDate.getTime() + 1000*60*60*24)
    }
    
    // Define constants
    const daysString = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    
    if (list) {
      // Display a list of all active users
      let message = 'Active Users:\n'
      message += '```'
      for (const { date, users } of logs) {
        message += daysString[date.getUTCDay()] + ' '
        message += date.toISOString().substring(0,10) + ' | '
        message += `Count: ${users.length}\n`
        
        for (const user of users) {
          const { firstName, lastName, email } = user
          message += `\t- ${firstName} ${lastName} (${email})\n`
        }
      }
      message += '```'

      msg.channel.send(message)
    } else {
      // Display a bar graph of active users over time

      // Generate labels and data based on logs
      const labels = [], data = []
      for (let i = logs.length - 1; i >= 0; i--) {
        const { date, users } = logs[i]
        labels.push(date.toISOString().substring(0,10))
        data.push(users.length)
      }

      // Generate chart using QuickChart API
      const chart = {
        type: 'bar',
        data: {
          labels,
          datasets: [{
            label: 'Active Users',
            data,
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                stepSize: 1,
              }
            }],
          },
        },
      }

      const encodedChart = encodeURIComponent(JSON.stringify(chart))
      const chartUrl = `https://quickchart.io/chart?c=${encodedChart}&backgroundColor=white`
      const chartEmbed = {
        title: 'Active Users',
        image: {
          url: chartUrl,
        },
      }

      msg.channel.send({ embed: chartEmbed })
    }
  },
}