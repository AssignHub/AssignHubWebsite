const express = require('express')
const router = express.Router()
const fetch = require('node-fetch')
const User = require('../models/user')
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
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: 'http://localhost:8080'
      })
    })

    // Find user and update info and tokens
    const expiresAt = new Date(new Date().getTime() + tokenData.expires_in*1000).getTime()
    const profileData = await getProfile(tokenData.access_token)
    const userData = { 
      firstName: profileData.given_name, 
      lastName: profileData.family_name, 
      email: profileData.email,
      pic: profileData.picture,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      accessTokenExpireDate: expiresAt, 
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
    
    // TODO: return jwt stuff
    res.json(user)
  } catch(err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

const _fetch = (path, options) => fetch(path, options)
  .then(res => res.json())
  .then(data => {
    if (data.error)
      throw data

    return data
  })

const getProfile = (accessToken) => {
  return _fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
  })
}

const getAccessToken = (refreshToken) => {
  return _fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })
  })
}

module.exports = router