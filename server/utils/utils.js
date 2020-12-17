const fetch = require('node-fetch')
require('dotenv').config()

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
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    })
  })
}

const getExpireDate = (expiresIn) => {
  return new Date(new Date().getTime() + expiresIn*1000).getTime()
}

module.exports = { _fetch, getProfile, getAccessToken, getExpireDate }