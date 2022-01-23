const mongoose = require('mongoose')
const Class = require('../models/class')
const TROJAN = require('trojan-course-api')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', async () => {
  console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`)

  const classes = await Class.collection.find().toArray()

  for (const doc of classes) {
    const { term, sectionId, courseId } = doc
    let school, type
    if (term.length === 4) {
      school = 'berkeley'
    } else {
      school = 'usc'

      const options = { term }
    
      const section = await TROJAN.course(courseId, options).then(data => {
        return data.courses[courseId].sections[sectionId]
      })

      // Define typeMap
      const typeMap = {
        'Lec': 'Lecture',
        'Lec-Lab': 'Lecture',
        'Dis': 'Discussion',
        'Lab': 'Lab',
        'Qz': 'Quiz',
      }

      type = typeMap[section.type]
    }
    /*Class.collection.update({ _id: doc._id }, {
      $set: {
        type,
        school,
      },
    })*/
  }
})