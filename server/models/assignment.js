const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  public: { type: Boolean, required: true },
})

module.exports = mongoose.model('Assignment', assignmentSchema)