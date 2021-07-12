const mongoose = require('mongoose')
const User = require('../models/class')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', async () => {
  console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`)

  User.collection.find().forEach((doc) => {
    const instructor = doc.instructor
    if (instructor) {
      User.collection.update({ _id: doc._id }, {
        $set: {
          instructors: [instructor]
        },
        $unset: { instructor: true },
      })
    }
  })
})