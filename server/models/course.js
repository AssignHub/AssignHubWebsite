const mongoose = require('mongoose')

const courseSchema = new mongoose.Schema({
  courseId: { type: String, required: true },
  sectionId: { type: String, required: true },
  instructor: { 
    firstName: { type: String },
    lastName: { type: String }
  },
})

module.exports = mongoose.model('Course', courseSchema)