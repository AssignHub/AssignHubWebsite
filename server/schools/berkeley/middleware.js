const reqlib = require('app-root-path').require
const Class = reqlib('/models/class')

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