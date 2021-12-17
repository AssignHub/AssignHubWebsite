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

dailyUserLogSchema.index({ date: -1 }, { unique: true })

dailyUserLogSchema.statics.findByDate = async function({ date, timezoneOffset }) {
  /* 
  Finds a daily user log, localized to the user's month/day/year, by:
  Checking if the given date (in server time) and timezone offset (in client time) match the day of a daily user log (in UTC time) 
  If none exist, then create a new daily log

  Note: we find the log localized to the user's month/day/year in order to track if the user has signed in on different days in their 
  own timezone, rather than the server's timezone. For example, if a user signed in at 11pm on Monday, then signed in at 8am on Tuesday,
  it could theoretically count as the same day if we were to use server time
  */
  const adjustedDate = new Date(date.getTime() - timezoneOffset*1000*60)
  const isoDate = adjustedDate.toISOString().substring(0, 10)
  const startDate = new Date(`${isoDate}T00:00:00.000Z`)
  const endDate = new Date(`${isoDate}T23:59:59.999Z`)

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