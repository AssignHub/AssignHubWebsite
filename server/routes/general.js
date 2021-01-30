const router = require('express').Router()
const { Moods } = require('../models/user')
const { getUser } = require('../middleware/auth')
const editJsonFile = require('edit-json-file')
const cron = require('node-cron')
const User = require('../models/user')
const { emitToUser } = require('../websockets')

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

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router