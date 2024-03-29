const reqlib = require('app-root-path').require
const editJsonFile = require('edit-json-file')
const express = require('express')
const url = require('url')
const router = express.Router()
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const User = reqlib('models/user')

const { getUser } = reqlib('middleware/auth')
const { escapeRegExp, _fetch } = reqlib('utils/utils')
const { sendMail } = reqlib('mailer')
const { getEmailsMap } = reqlib('schools/emails_map')
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
    let school
    const allowedEmails = editJsonFile(`${__dirname}/../config/general.json`).toObject().allowedEmails
    let emailAllowed = false
    for (let email of allowedEmails) {
      const regex = escapeRegExp(email).replace(/\\\*/g, '.*')
      if (profileData.email.match(`^${regex}$`)) {
        emailAllowed = true
        break
      }
    }

    // Check hardcoded emails 
    const emailsMap = getEmailsMap()
    if (emailsMap.has(profileData.email)) {
      school = emailsMap.get(profileData.email)
      emailAllowed = true
    }

    if (process.env.NODE_ENV !== 'development' && !emailAllowed) {
      res.status(403).json({ error: 'email-not-allowed' })
      return
    }

    // Find user if exists and update user data
    if (!school) school = profileData.email.match(/(?:[.@](.+?))+\..+/)[1]
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
    
    // Start authenticated session
    req.session.userId = user._id

    res.json({ isNewUser })
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/sign-in-chrome-ext', async (req, res) => {
  /* Signs in from the AssignHub chrome extension */

  try {
    const { state: socketId, access_token: accessToken, token_type: tokenType } = req.query

    const data = await _fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      method: 'GET',
      headers: {
        'Authorization': `${tokenType} ${accessToken}`
      }
    })

    // TODO: make this create a new account if it doesn't exist
    const user = await User.find({
      email: data.email
    }).lean()

    req.session.userId = user[0]._id

    res.end()
  } catch (err) {
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