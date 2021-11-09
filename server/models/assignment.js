const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: false },
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  public: { type: Boolean, required: true },
  noClass: { type: Boolean, default: false },
})

module.exports = mongoose.model('Assignment', assignmentSchema)