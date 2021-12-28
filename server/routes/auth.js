const reqlib = require('app-root-path').require
const editJsonFile = require('edit-json-file')
const express = require('express')
const router = express.Router()

const User = reqlib('models/user')
const DailyUserLog = reqlib('models/daily_user_log')

const { _fetch, getProfile, getExpireDate } = reqlib('utils/utils')
const { getUser } = reqlib('middleware/auth')
const { escapeRegExp } = reqlib('utils/utils')
const { sendMail } = reqlib('mailer')
const discordBot = reqlib('discord_bot')
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
        redirect_uri: process.env.NODE_ENV === 'development' ? 'http://localhost:8080' : 'https://assignhub.app',
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
    if (process.env.NODE_ENV !== 'development' && !emailAllowed) {
      res.status(403).json({ error: 'email-not-allowed' })
      return
    }

    // Find user if exists and update user data
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
    
    let isNewUser = false
    if (!user) {
      // Create new account if no account exists for email
      isNewUser = true
      user = await new User(userData).save()
      console.log('New account created: ', profileData.email)
      discordBot.sendMessage(`:wave: ${profileData.given_name} ${profileData.family_name} (${profileData.email}) has joined AssignHub!`)
    }

    // Update daily user log if user not already added
    const log = await DailyUserLog.findByDate({ date: new Date(), timezoneOffset })
    if (!log.users.includes(user._id)) {
      log.users.push(user._id)
      await log.save()
    }
    
    // Start authenticated session
    req.session.userId = user._id

    res.json({ isNewUser })
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