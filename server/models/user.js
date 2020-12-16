const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  pic: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  accessTokenExpireDate: {
    type: Number
  },
})

module.exports = mongoose.model('User', userSchema)