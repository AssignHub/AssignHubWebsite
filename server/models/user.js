const mongoose = require('mongoose')

const Moods = Object.freeze({
  Crying: 'crying',
  Sad: 'sad',
  Tired: 'tired',
  Smiling: 'smiling',
  Sunglasses: 'sunglasses',
})

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
  hiddenAssignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' }],

  // Friends and mood
  mood: { type: String, enum: Object.values(Moods) },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
})

userSchema.virtual('basicInfo').get(function() {
  return {
    _id: this._id,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    pic: this.pic,
  }
})

userSchema.virtual('fullName').get(function() {
  return this.firstName + ' ' + this.lastName
})

userSchema.virtual('outgoingFriendRequests', {
  ref: 'FriendRequest',
  localField: '_id',
  foreignField: 'from',
})

userSchema.virtual('incomingFriendRequests', {
  ref: 'FriendRequest',
  localField: '_id',
  foreignField: 'to',
})

Object.assign(userSchema.statics, { Moods })

module.exports = mongoose.model('User', userSchema)