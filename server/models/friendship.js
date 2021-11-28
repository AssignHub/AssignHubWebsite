const mongoose = require('mongoose')

const friendshipSchema = new mongoose.Schema({
  people: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
}, 
{
  timestamps: true,
})

module.exports = mongoose.model('Friendship', friendshipSchema)