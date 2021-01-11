const router = require('express').Router()
const User = require('../models/user')
const { getUser } = require('../middleware/auth')
const { escapeRegExp } = require('../utils/utils')

router.get('/mine', getUser, async (req, res) => {
  // Get current user's friends
  // Requires authentication

  try {
    await res.locals.user.friends.populate({
      path: 'friends',
      select: 'firstName lastName email pic mood'
    }).execPopulate()

    res.json(res.locals.user.friends)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/search', getUser, async (req, res) => {
  // Search for friend by name or email
  // Requires authentication

  /* Query params:
  *  query - the search query
  */

  let { query } = req.query
  query = decodeURIComponent(query)
  const queryTermsRegex = query.split(' ').map(term => new RegExp(escapeRegExp(term), 'i'))

  try {
    // Find users that contain all of the query terms among their firstName, lastName, and email
    const users = await User.find({
      $expr: {
        $reduce: {
          input: queryTermsRegex,
          initialValue: true,
          in: { $and: [
            '$$value',
            { $regexMatch: { input: { $concat: ['$firstName', ' ', '$lastName', ' ', '$email'] }, regex: '$$this' } }
          ]},
        },
      },
    }, 'firstName lastName email pic')

    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/add', getUser, async (req, res) => {
  // Adds user to current user's friends list
  // Requires authentication

  /* Body params:
  *  userId - the userId of friend to add
  */
  
  const { userId } = req.body
  try {
    const friendToAdd = await User.findById(userId)
    
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router