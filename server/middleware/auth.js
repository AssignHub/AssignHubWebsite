const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { getAccessToken, getExpireDate } = require('../utils/utils')
require('dotenv').config()

exports.checkToken = (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (authHeader) {
    const token = authHeader.split(' ')[1]
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      res.userId = decoded.userId
      next()
    } catch (err) {
      console.error(err)
      res.status(403).json({ error: 'invalid-token' })
    }
  } else {
    console.error('No authorization token provided!')
    res.status(403).json({ error: 'no-token' })
  }
} 

exports.getUser = async (req, res, next) => {
  if (res.userId) {
    try {
      res.user = await User.findById(res.userId)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: 'user-does-not-exist' })
    }
    
    if (res.user.accessTokenExpireDate < new Date().getTime()) {
      // Update access token if expired
      try {
        const accessTokenData = await getAccessToken(res.user.refreshToken)
        res.user.accessToken = accessTokenData.access_token,
        res.user.accessTokenExpireDate = getExpireDate(accessTokenData.expires_in)

        res.user = res.user.save()
      } catch (err) {
        console.error(err)
        res.status(403).json({ error: 'invalid-token' })
      }
    }

    next()
  } else {
    console.error('res.userId not found!')
    res.status(500).json({ error: 'no-user-id' })
  }
}