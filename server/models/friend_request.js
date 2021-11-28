const mongoose = require('mongoose')

const friendRequestSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  lastReminded: { type: Date, required: true },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},
{
  timestamps: true,
})

module.exports = mongoose.model('FriendRequest', friendRequestSchema)