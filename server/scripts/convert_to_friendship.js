const mongoose = require('mongoose')
const User = require('../models/user')
const Friendship = require('../models/friendship')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', async () => {
  console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`)

  const users = await User.collection.find().toArray()
  //console.log(users)
  for (let doc of users) {
    for (let friendId of doc.friends) {
      const results = await Friendship.collection.find({ people: { $all: [doc._id, friendId] } }).toArray()

      if (results.length === 0) {
        await new Friendship({
          people: [doc._id, friendId]
        }).save()
      }
    }

  }
})