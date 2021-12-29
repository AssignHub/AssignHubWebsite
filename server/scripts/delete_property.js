const mongoose = require('mongoose')
const User = require('../models/user')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', async () => {
  console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`)

  User.collection.updateMany({}, {$unset: {friends: true, accessToken: true, refreshToken: true, accessTokenExpireDate: true}}, () => console.log('success!'))
})