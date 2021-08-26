const router = require('express').Router()
const User = require('../models/user')
const FriendRequest = require('../models/friend_request')
const { getUser } = require('../middleware/auth')
const { escapeRegExp } = require('../utils/utils')
const { emitToUser } = require('../websockets')

router.get('/mine', getUser, async (req, res) => {
  // Get current user's friends
  // Requires authentication

  try {
    await res.locals.user.populate({
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
      populate: {
        path: 'to',
        select: 'firstName lastName email pic',
      },  
    }).populate({
      path: 'incomingFriendRequests',
      populate: {
        path: 'from',
        select: 'firstName lastName email pic',
      }
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

  // TODO: check if request has already been sent to current user, and if so, res.redirect('accept-request')

  const { userId } = req.body
  try {
    // Check if request has already been sent to current user by the "to" user
    //await res.locals.user.populate('incomingFriendRequests').execPopulate()


    const request = await new FriendRequest({
      timestamp: new Date(),
      from: res.locals.user._id, 
      to: userId,
      lastReminded: new Date()
    }).save()

    const toUser = await User.findById(userId, 'firstName lastName email pic').lean()

    emitToUser(res.locals.user._id, 'addFriendRequest', { 
      type: 'outgoing', 
      request: {
        _id: request._id,
        to: toUser,
      } 
    })
    emitToUser(userId, 'addFriendRequest', { 
      type: 'incoming',
      request: {
        _id: request._id,
        from: res.locals.user.basicInfo,
      } 
    })

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
    if (friendRequest.to._id != res.locals.user._id.toString()) {
      // Friend request was not directed to you
      res.status(403).json({ error: 'not-allowed' })
      return
    }

    friendRequest.from.friends.push(friendRequest.to._id)
    friendRequest.to.friends.push(friendRequest.from._id)
    await Promise.all([ friendRequest.from.save(), friendRequest.to.save() ])
    await FriendRequest.findByIdAndDelete(friendRequestId)

    emitToUser(friendRequest.from._id, 'removeFriendRequest', friendRequestId)
    emitToUser(friendRequest.to._id, 'removeFriendRequest', friendRequestId)
    emitToUser(friendRequest.from._id, 'addFriend', friendRequest.to.basicInfo)
    emitToUser(friendRequest.to._id, 'addFriend', friendRequest.from.basicInfo)
    
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.delete('/reject-request', getUser, async (req, res) => {
  // Delete friend request
  // Requires authentication

  /* Body params:
  *  friendRequestId - the id of the friend request
  */

  const { friendRequestId } = req.body
  try {
    const friendRequest = await FriendRequest.findById(friendRequestId).lean()
    if (friendRequest.to != res.locals.user._id.toString()) {
      // Friend request was not directed to you
      res.status(403).json({ error: 'not-allowed' })
      return
    }
    await FriendRequest.findByIdAndDelete(friendRequestId)

    emitToUser(friendRequest.from, 'removeFriendRequest', friendRequestId)
    emitToUser(friendRequest.to, 'removeFriendRequest', friendRequestId)

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.delete('/cancel-request', getUser, async (req, res) => {
  // Cancels a friend request you sent
  // Requires authentication

  /* Body params:
  *  friendRequestId - the id of the friend request
  */

  const { friendRequestId } = req.body
  try {
    const friendRequest = await FriendRequest.findById(friendRequestId).lean()
    if (friendRequest.from != res.locals.user._id.toString()) {
      // Friend request was not created by you
      res.status(403).json({ error: 'not-allowed' })
      return
    }
    await FriendRequest.findByIdAndDelete(friendRequestId)

    emitToUser(friendRequest.from, 'removeFriendRequest', friendRequestId)
    emitToUser(friendRequest.to, 'removeFriendRequest', friendRequestId)

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.delete('/:friendId', getUser, async (req, res) => {
  // Remove a friend 
  // Requires authentication

  /* Params:
  *  friendId - the id of the friend to remove
  */

  const { friendId } = req.params
  try {
    const friend = await User.findById(friendId)
    if (!friend) {
      // Friend user doesn't exist
      res.status(404).json({ error: 'user-not-found' })
      return
    }

    res.locals.user.friends = res.locals.user.friends.filter(id => id != friendId)
    friend.friends = res.locals.user.friends.filter(id => id != res.locals.user._id)
    await res.locals.user.save()
    await friend.save()

    emitToUser(res.locals.user._id, 'removeFriend', friendId)
    emitToUser(friendId, 'removeFriend', res.locals.user._id)

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }

})

module.exports = router