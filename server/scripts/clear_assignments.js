const mongoose = require('mongoose')
const Assignment = require('../models/assignment')
const User = require('../models/user')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', async () => {
  console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`)

  const allUsers = await User.find({})
  allUsers.forEach(async (user) => {
    user.assignments = []
    user.hiddenAssignments = []
    user.save()
  })

  console.log('removing')
  await Assignment.deleteMany({})
  console.log('removed!')
})