const router = require('express').Router()
const User = require('../models/user')
const FriendRequest = require('../models/friend_request')
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

router.get('/requests', getUser, async (req, res) => {
  // Get all incoming and outgoing friend requests
  // Requires authentication

  try {
    await res.locals.user.populate({
      path: 'outgoingFriendRequests',
      select: 'firstName lastName email pic',
    }).populate({
      path: 'incomingFriendRequests',
      select: 'firstName lastName email pic',
    }).execPopulate()

    res.json({
      outgoing: res.locals.user.outgoingFriendRequests,
      incoming: res.locals.user.incomingFriendRequests,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/create-request', getUser, async (req, res) => {
  // Create a new friend request
  // Requires authentication

  /* Body params:
  *  userId - the userId of the friend to add
  */

  const { userId } = req.body
  try {
    await new FriendRequest({
      from: res.locals.user._id, 
      to: userId,
    }).save()

    res.status(201).json({ sucess: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/accept-request', getUser, async (req, res) => {
  // Accept friend request and delete friend request
  // Requires authentication

  /* Body params:
  *  friendRequestId - the id of the friend request
  */
  
  const { friendRequestId } = req.body
  try {
    const friendRequest = await FriendRequest.findById(friendRequestId).populate('from').populate('to')
    if (friendRequest.to._id != res.locals.user._id) {
      // Friend request was not directed to you
      res.status(403).json({ error: 'not-allowed' })
      return
    }

    friendRequest.from.friends.push(friendRequest.to._id)
    friendRequest.to.friends.push(friendRequest.from._id)
    await Promise.all([ friendRequest.from.save(), friendRequest.to.save() ])
    await FriendRequest.findByIdAndDelete(friendRequestId)
    
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router