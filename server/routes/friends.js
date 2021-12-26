const router = require('express').Router()
const reqlib = require('app-root-path').require
const User = reqlib('models/user')
const FriendRequest = reqlib('models/friend_request')
const Friendship = reqlib('models/friendship')
const { getUser } = reqlib('middleware/auth')
const { escapeRegExp } = reqlib('utils/utils')
const { emitToUser } = reqlib('websockets')
const { getTerm } = reqlib('middleware/general')

router.get('/mine', getUser, async (req, res) => {
  // Get current user's friends
  // Requires authentication

  try {
    // Populate friends array and return basic data for each friend
    const result = await Friendship.find({ people: res.locals.user._id })
    
    // Format friends array
    const friends = []
    for (let friendship of result) {
      // Filter out current user from people array
      const arr = friendship.people.filter(id => id.toString() != res.locals.user._id.toString())
      
      // Make sure we have a valid friendship
      if (arr.length !== 1) continue 

      const friendId = arr[0]
      const friend = await User.findById(friendId)
      
      // Make sure friend user exists before adding it to the array
      if (friend != null)
        friends.push(friend.basicInfo)
    }

    res.json(friends)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/:uid/classes', getUser, getTerm, async (req, res) => {
  // Get all the classes of the given friend for the given term

  // Requires authentication

  /* Query params:
  *  term - the desired term
  */

  const { uid } = req.params
  try {
    // Check if friend is a friend of user
    const result = await Friendship.findOne({ people: { $all: [res.locals.user._id, uid] } }).lean()
    if (!result) {
      res.status(404).json({ error: 'friend-not-found' })
      return
    }

    // Populate friend's classes
    const friend = await User
      .findById(uid)
      .populate({
        path: 'classes.class',
        match: { term: res.locals.term },
      })
      .lean()

    // Get rid of null values and format
    const classes = friend.classes
      .filter(c => c.class)
      .map(({ _id, class: classData, ...rest }) => {
        return { ...classData, ...rest }
      })

    res.json(classes)
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
    // Populate current user's outgoing and incoming friend requests with basic data about
    // who it's being sent to or who it's being sent from
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

    // Create new friend request object
    const request = await new FriendRequest({
      timestamp: new Date(),
      lastReminded: new Date(),
      from: res.locals.user._id, 
      to: userId,
    }).save()

    const toUser = await User.findById(userId, 'firstName lastName email pic').lean()

    // Emit the creation of the friend request to both toUser and fromUser
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
    // Populate friend request fields
    const friendRequest = await FriendRequest.findById(friendRequestId).populate('from').populate('to')
    
    if (friendRequest.to._id != res.locals.user._id.toString()) {
      // Friend request was not directed to you
      res.status(403).json({ error: 'not-allowed' })
      return
    }

    // Create friendship in database
    await new Friendship({
      people: [ friendRequest.from._id, friendRequest.to._id ]
    }).save()

    // Delete friend request because it was accepted
    await FriendRequest.findByIdAndDelete(friendRequestId)

    // Inform users about friend request removal and friend addition
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

    // Delete friend request
    await FriendRequest.findByIdAndDelete(friendRequestId)

    // Inform users about friend request removal
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

    // Delete friend request
    await FriendRequest.findByIdAndDelete(friendRequestId)

    // Inform users about friend request removal
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

    // Find friendship and delete it
    await Friendship.deleteMany({ people: { $all: [res.locals.user._id, friendId] } })

    // Inform users about friend removal
    emitToUser(res.locals.user._id, 'removeFriend', friendId)
    emitToUser(friendId, 'removeFriend', res.locals.user._id)

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }

})

module.exports = router