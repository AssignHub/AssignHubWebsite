const router = require('express').Router()
const { Moods } = require('../models/user')
const { getUser } = require('../middleware/auth')
const { emitToUser } = require('../websockets')

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