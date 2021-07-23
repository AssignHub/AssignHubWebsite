const mongoose = require('mongoose')
const FriendRequest = require('../models/friend_request')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', async () => {
  console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`)

  FriendRequest.collection.find().forEach((doc) => {
    FriendRequest.collection.update({ _id: doc._id }, {
      $set: {
        timestamp: new Date(),
      },
    })
  })
})