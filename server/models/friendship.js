const mongoose = require('mongoose')

const friendshipSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  person1: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  person2: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
})

module.exports = mongoose.model('Friendship', friendshipSchema)