const mongoose = require('mongoose')
const DailyUserLog = require('../models/daily_user_log')
require('dotenv').config()

// Connect to database
/*mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', async () => {
  console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`)

  const log = await DailyUserLog.findByDate({ date: new Date(), timezoneOffset: new Date().getTimezoneOffset() })
  console.log(log)
})*/

const TROJAN = require('trojan-course-api')
console.log(TROJAN.parseCourseId('cscii257a'))
TROJAN.depts().then(({ departments }) => {
  for (const key in departments) {
    const { depts } = departments[key]
    if (depts) {
      for (const dept in depts) {
        console.log(dept)
      }
    }
  }
})

//TROJAN.courses('CSCI', { term: 20221 }).then(console.log)
//TROJAN.course('ENGR-100', { term: 20221 }).then(console.log)

/*TROJAN.courses('ENGR', { term: 20213 }).then(data => {
  console.log(data)
})*/



/*const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'assignhubteam@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD,
  },  
})

transporter.sendMail({
  from: 'AssignHub <contact@assignhub.app>',
  to: 'liu.z.jonathan@gmail.com',
  subject: 'another subject',
  text: 'test body!!! hello there'
}, (err, info) => {
  if (err) {
    console.error(err)
  } else {
    console.log('Email sent! ', info.response)
  }
})*/