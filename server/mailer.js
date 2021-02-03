const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_ADDRESS,
    pass: process.env.GMAIL_APP_PASSWORD,
  },  
})

exports.sendMail = (options) => transporter.sendMail({
  from: 'AssignHub <contact@assignhub.app>',
  ...options,
})