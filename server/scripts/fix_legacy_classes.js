const reqlib = require('app-root-path').require
const axios = require('axios')
const mongoose = require('mongoose')
const Class = reqlib('models/class')
const TROJAN = require('trojan-course-api')
const { getClasses } = reqlib('schools/berkeley/utils')
require('dotenv').config()

// Connect to database
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
const db = mongoose.connection
db.on('error', err => console.error(err))
db.on('open', async () => {
  console.log(`Successfully connected to db: ${process.env.DATABASE_URL}`)

  const classes = await Class.collection.find().toArray()

  const berkClasses = getClasses()

  for (const doc of classes) {
    const { term, sectionId, courseId } = doc
    let school, type
    if (term.length === 4) {
      school = 'berkeley'
      
      
      
      // Define typeMap
      const typeMap = {
        'Lecture': 'Lecture',
        'Web-Based Lecture': 'Lecture',
        'Discussion': 'Discussion',
        'Laboratory': 'Lab',
      }
      const sections = await axios.get(`https://berkeleytime.com/api/catalog/catalog_json/course_box/?course_id=${berkClasses.get(courseId)}`).then(response => response.data.sections)

      const section = sections.find(s => s.ccn == sectionId)
      type = typeMap[section.kind]
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
    console.log(school, type)
    Class.collection.update({ _id: doc._id }, {
      $set: {
        type,
        school,
      },
    })
  }
})