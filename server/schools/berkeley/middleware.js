const reqlib = require('app-root-path').require
const axios = require('axios')
const { getClasses } = require('./utils')
const Class = reqlib('/models/class')
const { splitLast } = reqlib('utils/utils')

exports.searchClass = async (req, res, next) => {
  /* Sets `res.locals.searchClassResults` to an array of all courseIds that match the given search `query` */

  const { query } = req.query

  try {
    // Format query into dept and courseNum
    let querySplit = splitLast(query, ' ')
    if (querySplit.length === 1) {
      // dept and courseNum are not separated by a space, separate them for user
      const numIndex = querySplit[0].search(/[0-9]/)
      querySplit = [querySplit[0].substring(0, numIndex), querySplit[0].substring(numIndex)]
    } 
    const [queryDept, queryCourseNum] = querySplit

    // Filter classes array based on query
    const courseIds = [...getClasses().keys()]
    res.locals.searchClassResults = courseIds.filter(c => {
      const [dept, courseNum] = splitLast(c, ' ')
      
      // Construct regex for dept searching by placing wildcard between characters and at the end
      // E.g. "CS" becomes "/^C.*S.*$/"
      const deptRegex = new RegExp('^' + [...queryDept, ''].join('.*') + '$')
      
      // Match if dept regex passes and courseNum is exactly correct
      return deptRegex.test(dept) && courseNum === queryCourseNum
    })

    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
}

exports.getSections = async (req, res, next) => {
  /* Sets res.locals.classSections to an array containing all the sections of the specified courseId */

  /* Query params:
  *  courseId - the courseId to search
  */

  const { courseId } = req.query

  try {

    const classes = getClasses()

    let sections = []
    try {
      // Define typeMap
      const typeMap = {
        'Lecture': 'Lecture',
        'Discussion': 'Discussion',
        'Laboratory': 'Lab',
      }

      // Fetch all sections.
      const data = await axios.get(`https://berkeleytime.com/api/catalog/catalog_json/course_box/?course_id=${classes.get(courseId)}`).then(response => response.data.sections)
      
      // Format sections to format described in general README.
      data.forEach(section => {

        let blocksData = []
        let instructorData = []
        
        // Get all blocks from array of DOW (day of week).
        for (let i = 0; i < section.word_days.length; i++) {
          let dow = section.word_days.charAt(i)
          if (section.word_days.charAt(i) == 'T') {
            if (section.word_days.charAt(i + 1) == 'h') {
              dow = "H"
            }
            i++;
          }
          blocksData.push({
            day: dow,
            start: section.start_time.substring(11, 16),
            end: section.end_time.substring(11, 16),
            location: section.location_name,
          })
        }

        // Format instructor data from string.
        if (section.instructor) {
          section.instructor.split(", ").forEach(instructor => {
            instructorData.push({
              firstName: instructor.split(" ")[1],
              lastName: instructor.split(" ")[0]
            })
          })
        }

        sections.push({
          term: res.locals.term,
          courseId: courseId,
          sectionId: section.ccn,
          blocks: blocksData,
          type: typeMap[section.kind],
          instructors: instructorData
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