const User = require('../models/user')
const { getAccessToken, getExpireDate } = require('../utils/utils')
require('dotenv').config()

exports.getUser = async (req, res, next) => {
  let userId

  // Allow for debugging of auth routes in development
  // Just pass testUserId as a body/query parameter
  if (process.env.NODE_ENV === 'development' && (req.body.testUserId || req.query.testUserId) ) {
    if (req.body.testUserId) 
      userId = req.body.testUserId 
    else 
      userId = req.query.testUserId
  } else {
    userId = req.session.userId
  }

  if (userId) {
    try {
      res.locals.user = await User.findById(userId)
      if (!res.locals.user) {
        throw 'User does not exist!'
      }
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'user-does-not-exist' })
      return
    }

    next()
  } else {
    res.status(401).json({ error: 'no-session' })
  }
}