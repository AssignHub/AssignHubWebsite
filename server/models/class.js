const mongoose = require('mongoose')

const classSchema = new mongoose.Schema({
  school: { type: String, required: true },
  term: { type: String, required: true },
  type: { type: String, required: true },
  courseId: { type: String, required: true },
  sectionId: { type: String, required: true },
  instructors: [{ 
    firstName: { type: String },
    lastName: { type: String },
  }],
  blocks: [{
    day: { type: String },
    start: { type: String },
    end: { type: String },
    location: { type: String }
  }],
  asynchronous: { type: Boolean },
  syllabusStatus: { type: String },
})

classSchema.methods.findMembers = function(cb) {
  return this.model('User').find({
    $expr: {
      $in: [ this._id, { $map: { input: '$classes', in: '$$this.class' } } ],
    },
  }, cb)
}

module.exports = mongoose.model('Class', classSchema)