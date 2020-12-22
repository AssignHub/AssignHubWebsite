const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  term: { type: String, required: true },
  courseId: { type: String, required: true },
  sectionId: { type: String, required: true },
  instructor: { 
    firstName: { type: String },
    lastName: { type: String },
  },
  blocks: { type: Array },
})

module.exports = mongoose.model('Course', courseSchema)