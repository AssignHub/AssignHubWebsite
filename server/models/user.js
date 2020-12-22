const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  // basicInfo
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  pic: { type: String, required: true },
  
  // Google OAuth
  accessToken: { type: String },
  refreshToken: { type: String },
  accessTokenExpireDate: { type: Number },

  // Classes and assignments
  classes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],
})

userSchema.virtual('basicInfo').get(function() {
  return {
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    pic: this.pic,
  }
})

module.exports = mongoose.model('User', userSchema)