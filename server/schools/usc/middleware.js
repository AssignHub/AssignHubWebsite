const TROJAN = require('trojan-course-api')
const reqlib = require('app-root-path').require
const Class = reqlib('/models/class')

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

      let instructors = []
      if (section.instructor) {
        if (section.instructor.hasOwnProperty('length')) {
          // instructor prop is an array of multiple instructors
          section.instructor.forEach(instructor => instructors.push({
            firstName: instructor.first_name,
            lastName: instructor.last_name,
          }))
        } else {
          // instructor prop contains a single instructor
          instructors.push({
            firstName: section.instructor.first_name,
            lastName: section.instructor.last_name,
          })
        }
      }

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