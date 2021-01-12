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

courseSchema.methods.findMembers = function(cb) {
  return this.model('User').find({
    $expr: {
      $in: [ this._id, { $map: { input: '$classes', in: '$$this.class' } } ],
    },
  }, cb)
}

module.exports = mongoose.model('Course', courseSchema)