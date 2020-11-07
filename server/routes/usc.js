const express = require('express')
const router = express.Router()
const TROJAN = require('trojan-course-api')
require('../utils/object_utils')

router.get('/terms', async (req, res) => {
  try {
    let terms = await TROJAN.terms().then(data => {
      return data.terms.map(term => { 
        term = '' + term
        let year = term.substring(0, 4)
        let seasons = ['Spring', 'Summer', 'Fall']
        let season = seasons[term.substring(4) - 1]
        return { term, text: `${season} ${year}` }
      })
    })
    res.json(terms)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/depts', async (req, res) => {
  /* Query params:
  *  term - the desired term
  */
  try {
    let options = req.query.term ? { term: req.query.term } : {}
    let depts = await TROJAN.deptsN(options).then(data => data.departments)
    res.json(depts)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/depts/:dept/courses', async (req, res) => {
  /* Query params:
  *  term - the desired term
  */
  try {
    let options = req.query.term ? { term: req.query.term } : {}
    let courses = await TROJAN.courses(req.params.dept, options).then(data => {
      return Object.map(data.courses, course => {
        return course.title
      })
    })
    res.json(courses)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

router.get('/courses/:courseId/sections', async (req, res) => {
  /* Query params:
  *  term - the desired term
  */
  try {
    let options = req.query.term ? { term: req.query.term } : {}
    let sections = await TROJAN.course(req.params.courseId, options).then(data => {
      let sectionsData = Object.filter(data.courses[req.params.courseId].sections, section => section.type === 'Lec')
      return Object.map(sectionsData, section => {
        return { instructor: section.instructor }
      })
    })
    res.json(sections)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router