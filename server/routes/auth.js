const reqlib = require('app-root-path').require
const editJsonFile = require('edit-json-file')
const express = require('express')
const router = express.Router()
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const User = reqlib('models/user')
const DailyUserLog = reqlib('models/daily_user_log')

const { getUser } = reqlib('middleware/auth')
const { escapeRegExp } = reqlib('utils/utils')
const { sendMail } = reqlib('mailer')
const discordBot = reqlib('discord_bot')
require('dotenv').config()

router.post('/sign-in', async (req, res) => {
  /* Body params:
  *  credential - the JWT credential obtained from google sign in
  *  timezoneOffset - the client's offset from UTC time
  */
  
  const { credential, timezoneOffset } = req.body
  try {
    // Parse user info from credential
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const profileData = ticket.getPayload()
    
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
      school
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