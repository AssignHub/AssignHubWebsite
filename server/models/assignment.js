const mongoose = require('mongoose')

const assignmentSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  class: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: false },
  name: { type: String, required: true },
  public: { type: Boolean, required: true },
  noClass: { type: Boolean, default: false },

  // One-time assignments
  dueDate: { type: Date },
  
  // Recurring assignments
  recurring: { type: Boolean, default: false },
  recurrence: {
    startDate: { type: Date },
    endDate: { type: Date },
    days: [{ type: Number }],
    time: { type: String },
  }
})

module.exports = mongoose.model('Assignment', assignmentSchema)