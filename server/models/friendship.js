/*
 * Collection containing the friendships that exist among users
 * The `people` property is guaranteed to be an array of 2 people representing 
 * a friendship between the first user and the second user in the array
 */
const mongoose = require('mongoose')

const friendshipSchema = new mongoose.Schema({
  people: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }],
}, 
{
  timestamps: true,
})

module.exports = mongoose.model('Friendship', friendshipSchema)