const express = require('express')
const router = express.Router()

router.post('/sign-in', (req, res) => {
  /* Body params:
  *  authCode - the authorization code for Google OAuth
  */
  fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code: req.body.authCode,
      client_id: 
    })
  })
  res.json({ success: true })
})

module.exports = router