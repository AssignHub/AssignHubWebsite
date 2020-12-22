const express = require('express')
const router = express.Router()
const TROJAN = require('trojan-course-api')
const Course = require('../models/course')
const { getUser } = require('../middleware/auth')
require('../utils/object_utils')

// Middleware
const getTerm = (req, res, next) => {
  if (!req.query.term) {
    res.status(400).json({error: 'The term query param is required!'})
    return 
  } else {
    res.locals.term = req.query.term
    next()
  }
}

// Routes
router.get('/terms', async (req, res) => {
  try {
    const terms = await TROJAN.terms().then(data => {
      return data.terms.map(term => { 
        term = '' + term
        const year = term.substring(0, 4)
        const seasons = ['Spring', 'Summer', 'Fall']
        const season = seasons[term.substring(4) - 1]
        return { term, text: `${season} ${year}` }
      })
    })
    res.json(terms)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/add-class', getUser, getTerm, async (req, res) => {
  // Requires authentication

  /* Query params:
  *  term - the desired term
  */

  /* Body params:
  *  courseId - the class's course id (e.g. BUAD-304)
  *  sectionId - the class's section id (e.g. 12345)
  */
  
  let section;
  try {
    const options = { term: res.locals.term }
    section = await TROJAN.course(req.body.courseId, options).then(data => {
      return data.courses[req.body.courseId].sections[req.body.sectionId]
    })
  } catch (err) {
    // If course ID is wrong 
    res.status(404).json({ error: 'class-not-found' })
    return
  }

  try {
    if (!section) {
      // If section number is wrong
      res.status(404).json({ error: 'class-not-found' })
      return
    }

    if (section.type !== 'Lec') {
      res.status(400).json({ error: 'class-not-lec' })
      return
    }

    // Find course, create new one if doesn't exist
    let course = await Course.findOne({ 
      term: res.locals.term,
      courseId: req.body.courseId, 
      sectionId: req.body.sectionId,
    })

    if (!course) {
      const courseData = {
        term: res.locals.term,
        courseId: req.body.courseId,
        sectionId: req.body.sectionId,
        instructor: {
          firstName: section.instructor.first_name,
          lastName: section.instructor.last_name,
        },
        blocks: section.blocks
      }
      course = await new Course(courseData).save()
    }
    
    if (!res.locals.user.classes.includes(course._id))
      res.locals.user.classes.push(course._id)
    await res.locals.user.save()

    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/my-classes', getUser, getTerm, async (req, res) => {
  // Requires authentication

  /* Query params:
  *  term - the desired term
  */
  try {
    await res.locals.user.populate({
      path: 'classes',
      match: { term: res.locals.term }
    }).execPopulate()
    res.json({ classes: res.locals.user.classes })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router