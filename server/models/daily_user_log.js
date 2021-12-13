/*
 * Collection containing the active users for a certain day
 * The `users` array contains all the users that were active on the particular day
 * The day is denoted by the `date` field 
 */
const mongoose = require('mongoose')

const dailyUserLogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
})

dailyUserLogSchema.statics.findByDate = async function({ date, timezoneOffset }) {
  /* 
  This finds a daily user log, localized to the user's month/day/year, by:
  Checking if the given date (in server time) and timezone offset (in client time) match the day of a daily user log (in UTC time) 
  If none exist, then create a new daily log
  */
  const adjustedDate = new Date(date.getTime() - timezoneOffset*1000*60)
  const utcDate = adjustedDate.getUTCDate()
  const utcFullYear = adjustedDate.getUTCFullYear()
  const utcMonth = adjustedDate.getUTCMonth()
  const startDate = new Date(`${utcFullYear}-${utcMonth}-${utcDate}T00:00:00.000Z`)
  const endDate = new Date(`${utcFullYear}-${utcMonth}-${utcDate}T23:59:59.999Z`)

  // Find a log for the current date
  let log = await this.findOne({
    date: { $gte: startDate, $lte: endDate },
  })

  // Create a new log if it doesn't exist already
  if (!log) {
    log = new this({
      date: startDate,
    }) 
    await log.save()
  }

  return log
}

module.exports = mongoose.model('DailyUserLog', dailyUserLogSchema)