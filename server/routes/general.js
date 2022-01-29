const reqlib = require('app-root-path').require
const router = require('express').Router()
const { Moods } = require('../models/user')
const { getUser } = require('../middleware/auth')
const { emitToUser } = require('../websockets')
const DailyUserLog = reqlib('models/daily_user_log')

router.patch('/mood', getUser, async (req, res) => {
  // Set the mood of current user
  // Requires Authentication

  /* Body params:
  *  mood - mood to set to
  */

  const { mood } = req.body
  try {
    if (!Object.values(Moods).includes(mood)) {
      res.status(400).json({ error: 'invalid-mood' })
    }
    res.locals.user.mood = mood
    await res.locals.user.save()

    for (let id of res.locals.user.friends) {
      emitToUser(id, 'setFriendMood', { friendId: res.locals.user._id, mood })
    }

    res.end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})


router.post('/set-active', getUser, async (req, res) => {
  /* Adds current user to daily user log if they aren't already in it */
  
  try {
    const user = res.locals.user
    const log = await DailyUserLog.findByDate({ date: new Date(), timezoneOffset: user.timezoneOffset })
    if (!log.users.includes(user._id)) {
      log.users.push(user._id)
      await log.save()
    }

    res.end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router