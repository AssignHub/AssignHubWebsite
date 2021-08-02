const express = require('express')
const router = express.Router()
const User = require('../models/user')
const { _fetch, getProfile, getExpireDate } = require('../utils/utils')
const { getUser } = require('../middleware/auth')
const editJsonFile = require('edit-json-file')
const { escapeRegExp } = require('../utils/utils')
const { sendMail } = require('../mailer')
const discordBot = require('../discord_bot')
require('dotenv').config()

router.post('/sign-in', async (req, res) => {
  /* Body params:
  *  authCode - the authorization code for Google OAuth
  *  timezoneOffset - the client's offset from UTC time
  */
  
  const { authCode, timezoneOffset } = req.body
  try {
    // Get token data from authCode
    const tokenData = await _fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        code: authCode,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: process.env.TESTING ? 'http://localhost:8080' : 'https://assignhub.app',
      })
    })

    // Find user and update info and tokens
    const profileData = await getProfile(tokenData.access_token)
    
    // Restrict emails
    const allowedEmails = editJsonFile(`${__dirname}/../config/general.json`).toObject().allowedEmails
    let emailAllowed = false
    for (let email of allowedEmails) {
      const regex = escapeRegExp(email).replace(/\\\*/g, '.*')
      if (profileData.email.match(`^${regex}$`)) {
        emailAllowed = true
        break
      }
    }
    if (!process.env.TESTING && !emailAllowed) {
      res.status(403).json({ error: 'email-not-allowed' })
      return
    }

    // Find user if exists
    const school = profileData.email.match(/(?:[.@](.+?))+\..+/)[1]
    const userData = { 
      lastSignIn: new Date(),
      timezoneOffset,
      firstName: profileData.given_name || 'null', 
      lastName: profileData.family_name || 'null', 
      email: profileData.email,
      pic: profileData.picture,
      school,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      accessTokenExpireDate: getExpireDate(tokenData.expires_in), 
    }
    let user = await User.findOneAndUpdate(
      { email: profileData.email }, 
      userData,
      { new: true },
    )
    
    if (!user) {
      // Create new account if no account exists for email
      user = await new User(userData).save()
      console.log('New account created: ', profileData.email)
      discordBot.sendMessage(`:wave: ${profileData.given_name} ${profileData.family_name} (${profileData.email}) has joined AssignHub!`)
    }
    
    // Start authenticated session
    req.session.userId = user._id

    res.json({ success: true })
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/sign-out', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err)
      res.status(500).json({ error: err })
    }
    res.send({ success: true })
  })
})

router.get('/profile', getUser, (req, res) => {
  // Get user info
  // Requires authentication
  
  res.json(res.locals.user.basicInfo)
})

module.exports = router