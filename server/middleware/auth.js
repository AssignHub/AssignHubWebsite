const User = require('../models/user')
const { getAccessToken, getExpireDate } = require('../utils/utils')
require('dotenv').config()

exports.getUser = async (req, res, next) => {
  if (req.session.userId) {
    try {
      res.locals.user = await User.findById(req.session.userId)
      if (!res.locals.user) {
        throw 'User does not exist!'
      }
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'user-does-not-exist' })
      return
    }
    
    if (res.locals.user.accessTokenExpireDate < new Date().getTime()) {
      // Update access token if expired
      try {
        const accessTokenData = await getAccessToken(res.locals.user.refreshToken)
        res.locals.user.accessToken = accessTokenData.access_token,
        res.locals.user.accessTokenExpireDate = getExpireDate(accessTokenData.expires_in)

        res.locals.user = res.locals.user.save()
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