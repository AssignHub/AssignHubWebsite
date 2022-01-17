const TROJAN = require('trojan-course-api')
const reqlib = require('app-root-path').require
const Class = reqlib('/models/class')
const { getInstructors } = require('./utils')

exports.searchClass = async (req, res, next) => {
  /* Sets res.locals.classSections to an array containing all the sections of the specified courseId */
  // getTerm must be called before this middleware

  /* Query params:
  *  courseId - the courseId to search
  */

  const { courseId } = req.query
  try {
    const options = { term: res.locals.term }

    let sections
    try {
      sections = await TROJAN.course(courseId, options).then(data => {
        return data.courses[courseId].sections
      })
    } catch (err) {
      // If course ID is wrong
      res.status(404).json({ error: 'class-not-found' })
      return
    }

    // Define typeMap
    const typeMap = {
      'Lec': 'Lecture',
      'Lec-Lab': 'Lecture',
      'Dis': 'Discussion',
      'Lab': 'Lab',
      'Qz': 'Quiz',
    }

    // Format sections
    sections = Object.keys(sections).map(sectionId => {
      const section = sections[sectionId]
      
      if (section.canceled) return null

      const { blocks, type } = section
      const instructors = getInstructors(section)

      return {
        term: res.locals.term,
        courseId, 
        sectionId, 
        blocks, 
        type: typeMap[type], 
        instructors
      }
    })

    // Filter out null values
    sections = sections.filter(Boolean)

    res.locals.classSections = sections

    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
}

exports.addClass = async (req, res, next) => {
  // getTerm must be called before this middleware

  /* Body params:
  *  courseId - the class's course id (e.g. BUAD-304)
  *  sectionId - the class's section id (e.g. 12345)
  */
  
  const { courseId, sectionId } = req.body

  try {
    // Find class, create new one if doesn't exist
    res.locals.class = await Class.findOne({ 
      term: res.locals.term,
      courseId, 
      sectionId,
    })

    if (!res.locals.class) {
      const options = { term: res.locals.term }

      let section
      try {
        section = await TROJAN.course(courseId, options).then(data => {
          return data.courses[courseId].sections[sectionId]
        })
      } catch (err) {
        // If course ID is wrong
        res.status(404).json({ error: 'class-not-found' })
        return
      }

      if (!section) {
        // If section number is wrong
        res.status(404).json({ error: 'class-not-found' })
        return
      }
  
      if (!section.type.includes('Lec')) {
        // If not a lecture section
        res.status(400).json({ error: 'class-not-lec' })
        return
      }

      let instructors = getInstructors(section)

      const classData = {
        term: res.locals.term,
        courseId,
        sectionId,
        instructors,
        blocks: section.blocks
      }
      res.locals.class = await new Class(classData).save()
    }

    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
}