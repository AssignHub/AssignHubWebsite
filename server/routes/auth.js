const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const { _fetch, getProfile, getExpireDate } = require('../utils/utils')
const { checkToken, getUser } = require('../middleware/auth')
require('dotenv').config()

router.post('/sign-in', async (req, res) => {
  /* Body params:
  *  authCode - the authorization code for Google OAuth
  */
  
  try {
    // Get token data from authCode
    const tokenData = await _fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: req.body.authCode,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:8080'
      })
    })

    // Find user and update info and tokens
    const profileData = await getProfile(tokenData.access_token)
    const userData = { 
      firstName: profileData.given_name, 
      lastName: profileData.family_name, 
      email: profileData.email,
      pic: profileData.picture,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      accessTokenExpireDate: getExpireDate(tokenData.expires_in), 
    }
    let user = await User.findOneAndUpdate(
      { email: profileData.email }, 
      userData,
      { new: true },
    )
    
    // Create new account if no account exists for email
    if (!user) {
      user = new User(userData).save()
    }
    
    // Return JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token })
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/profile', checkToken, getUser, (req, res) => {
  res.json(res.user.basicInfo)
})

module.exports = router