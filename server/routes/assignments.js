const express = require('express')
const router = express.Router()
const Assignment = require('../models/assignment')
const Course = require('../models/course')
const { getUser } = require('../middleware/auth')

const { getTerm } = require('../routes/usc') // TODO: replace when we get more schools

router.post('/create', getUser, async (req, res) => {
  // Requires authentication

  /* Body params:
  *  courseObjectId - ObjectId of the course assignment is associated with
  *  name - name of assignment
  *  dueDate - due date of assignment
  *  public - whether assignment is public (shared with everybody in your class)
  */
  const {courseObjectId, name, dueDate, public} = req.body

  try {
    const course = await Course.findById(courseObjectId)

    if (!course) {
      res.status(400).json({ error: 'invalid-course' })
      return
    }

    const assignment = await new Assignment({
      course: courseObjectId, name, dueDate, public
    }).save()

    res.locals.user.assignments.push({assignment: assignment._id})
    await res.locals.user.save()

    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.patch('/toggle/:assignmentId', getUser, async (req, res) => {
  // Requires authentication

  const { assignmentId } = req.params
  try {
    const index = res.locals.user.assignments.findIndex(a => a.assignment === assignmentId)
    res.locals.user.assignments[index].done = !res.locals.user.assignments[index].done
    await res.locals.user.save()

    res.json({ success: true })    
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/mine', getUser, getTerm, async (req, res) => {
  // Requires authentication

  /* Query params:
  *  term - the desired term
  */
  try {
    await res.locals.user.populate({
      path: 'assignments.assignment',
      match: { term: res.locals.term },
    }).execPopulate()
    const assignments = res.locals.user.assignments.filter(a => a.assignment !== null)

    res.json(assignments)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/public', getUser, getTerm, async (req, res) => {
  // Requires authentication

  /* Query params:
  *  term - the desired term
  */
  try {
    await res.locals.user.populate({
      path: 'classes.class',
      match: { term: res.locals.term },
      select: 'courseId',
    }).execPopulate()
    const classes = res.locals.user.classes.filter(c => c.class !== null)
    const courseIds = classes.map(c => c.class.courseId)
    
    const publicAssignments = await Assignment.find({ public: true }).populate({
      path: 'course',
      match: { term: res.locals.term },
    })
    res.json(publicAssignments.filter(a => a.course && courseIds.includes(a.course.courseId)))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router