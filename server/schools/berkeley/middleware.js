const reqlib = require('app-root-path').require
const axios = require('axios')
const { getClasses } = require('./utils')
const Class = reqlib('/models/class')

exports.searchClass = async (req, res, next) => {
  /* Sets res.locals.classSections to an array containing all the sections of the specified courseId */

  /* Query params:
  *  courseId - the courseId to search
  */

  const { courseId } = req.query

  try {

    const classes = getClasses()

    let sections = []
    try {

      // Fetch all sections.
      const data = await axios.get(`https://berkeleytime.com/api/catalog/catalog_json/course_box/?course_id=${classes.get(courseId)}`).then(response => response.data.course.sections)
      
      // Format sections to format described in general README.
      data.forEach(section => {

        let blocksData = []
        
        // Get all blocks from array of DOW (day of week).
        section.word_days.split("").forEach(dow => blocksData.push({
          day: dow,
          start: section.start_time.substring(10, 15),
          end: section.end_time.substring(10, 15)
        }))

        sections.push({
          courseId: courseId,
          sectionId: section.id,
          blocks: blocksData,
          type: section.kind,
          instructors: [{
            firstName: section.instructor.split(" ")[1],
            lastName: section.instructor.split(" ")[0]
          }]
        })
      })  
    } catch (err) {
      // If course ID is wrong
      res.status(404).json({ error: 'class-not-found' })
      return
    }

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
  *  sectionId - the class's section id (e.g. 12345)
  *  Params for creating a new class (optional):
  *  courseId - the class's course id (e.g. CS-160)
  *  blocks - array of days/times when the class takes place
  *  instructors - array of instructors that teach the class
  *  asynchronous - whether class is asynchronous or not
  */
  
  const { sectionId, courseId, blocks, instructors, asynchronous } = req.body

  try {
    // Find class, create new one if doesn't exist
    res.locals.class = await Class.findOne({ 
      term: res.locals.term,
      sectionId,
    })

    if (!res.locals.class) {
      if (!courseId || !blocks || !instructors) {
        // Send class not found error to prompt user to enter info to create new class
        res.status(404).json({ error: 'class-not-found' })
        return
      } else {
        // Create new class with info provided by user
        const classData = {
          term: res.locals.term,
          courseId,
          sectionId,
          instructors,
          blocks,
          asynchronous,
        }
        res.locals.class = await new Class(classData).save()
      }
    }

    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
}