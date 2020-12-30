const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  // basicInfo
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  pic: { type: String, required: true },
  
  // Google OAuth
  accessToken: String,
  refreshToken: String,
  accessTokenExpireDate: Number,

  // Classes and assignments
  classes: [{
    class: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    color: { type: String, required: true },
  }],
  assignments: [{ 
    assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
    done: { type: Boolean, default: false }, 
  }],
})

userSchema.virtual('basicInfo').get(function() {
  return {
    userId: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    pic: this.pic,
  }
})

module.exports = mongoose.model('User', userSchema)