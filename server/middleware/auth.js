const User = require('../models/user')
const { getAccessToken, getExpireDate } = require('../utils/utils')
require('dotenv').config()

exports.getUser = async (req, res, next) => {
  let userId

  // Allow for debugging of auth routes in development
  // Just pass userId as a body parameter
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
    
    if (process.env.NODE_ENV !== 'development' && res.locals.user.accessTokenExpireDate < new Date().getTime()) {
      // Update access token if expired
      try {
        const accessTokenData = await getAccessToken(res.locals.user.refreshToken)
        res.locals.user.accessToken = accessTokenData.access_token,
        res.locals.user.accessTokenExpireDate = getExpireDate(accessTokenData.expires_in)

        res.locals.user = await res.locals.user.save()
      } catch (err) {
        console.error(err)
        res.status(403).json({ error: 'invalid-token' })
        return
      }
    }

    next()
  } else {
    res.status(401).json({ error: 'no-session' })
  }
}