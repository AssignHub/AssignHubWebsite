const TROJAN = require('trojan-course-api')
TROJAN.courses('ENGR', { term: 20213 }).then(data => {
  console.log(data)
})



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