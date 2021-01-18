const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  public: { type: Boolean, required: true },
})

module.exports = mongoose.model('Assignment', assignmentSchema)