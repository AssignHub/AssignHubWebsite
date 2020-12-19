const User = require('../models/user')
const { getAccessToken, getExpireDate } = require('../utils/utils')
require('dotenv').config()

exports.getUser = async (req, res, next) => {
  console.log('session: ', req.session)
  if (req.session.userId) {
    try {
      res.locals.user = await User.findById(req.session.userId)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'user-does-not-exist' })
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
      }
    }

    next()
  } else {
    res.status(403).json({ error: 'no-session' })
  }
}