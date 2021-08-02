// TODO: catch error if req.body is wrong

const express = require('express')
const router = express.Router()
const { emitToUser } = require('../websockets')
const Assignment = require('../models/assignment')
const Class = require('../models/class')
const { getUser } = require('../middleware/auth')

const { getTerm } = require('../middleware/general')

router.get('/mine', getUser, getTerm, async (req, res) => {
  // Get all user's assignments for the current term

  // Requires authentication

  /* Query params:
  *  term - the desired term
  */
  try {
    await res.locals.user.populate({
      path: 'assignments.assignment',
      populate: {
        path: 'class',
        match: { term: res.locals.term },
        select: 'courseId',
      },
    }).execPopulate()
    const assignments = res.locals.user.assignments
      .filter(a => a.assignment.class !== null)
      .map(a => {
        a = a.toJSON()
        const { _id, assignment, ...rest } = a
        return { ...assignment, ...rest }
      })

    res.json(assignments)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/public', getUser, getTerm, async (req, res) => {
  // Get all the public assignments based on user's classes

  // Requires authentication

  /* Query params:
  *  term - the desired term
  */
  try {
    const excludedAssignmentIds = res.locals.user.assignments.map(a => a.assignment).concat(res.locals.user.hiddenAssignments)

    // Get courseIds for currently enrolled classes
    await res.locals.user.populate({
      path: 'classes.class',
      match: { term: res.locals.term },
      select: 'courseId',
    }).execPopulate()
    const courseIds = res.locals.user.classes.filter(c => c.class !== null).map(c => c.class.courseId)
    
    const publicAssignments = (await Assignment.find({ 
      public: true, 
      dueDate: { $gte: new Date().toISOString() },   
      _id: { $nin: excludedAssignmentIds }
    }).populate({
      path: 'class',
      match: { term: res.locals.term },
      select: 'courseId sectionId instructors'
    }).populate({
      path: 'creator',
      select: 'firstName lastName'
    }).lean()).filter(a => {
      return a.class && courseIds.includes(a.class.courseId)
    })

    res.json(publicAssignments)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/create', getUser, async (req, res) => {
  // Create a new assignment

  // Requires authentication

  /* Body params:
  *  classId - ObjectId of the class the assignment is associated with
  *  name - name of assignment
  *  dueDate - due date of assignment
  *  proofUrl - url where you can find the assignment
  *  submissionUrl - url where you can submit the assignment
  *  public - whether assignment is public (shared with everybody in your class)
  */
  const {classId, name, dueDate, proofUrl, submissionUrl, public} = req.body

  try {
    const _class = await Class.findById(classId)

    if (!_class) {
      res.status(400).json({ error: 'invalid-class' })
      return
    }

    const assignment = await new Assignment({
      creator: res.locals.user._id, 
      class: classId, 
      name, 
      dueDate,
      proofUrl,
      submissionUrl, 
      public
    }).save()

    res.locals.user.assignments.push({assignment: assignment._id})
    await res.locals.user.save()

    // Socket communication
    const assignmentPopulated = await assignment.populate({
      path: 'class',
      select: 'courseId',
    }).execPopulate()
    emitToUser(res.locals.user._id, 'addAssignment', { ...assignmentPopulated.toJSON(), done: false })

    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/add', getUser, async (req, res) => {
  // Add a public assignment

  /* Body params:
  *  assignmentId - id of the assignment to add
  */

  const { assignmentId } = req.body
  try {
    res.locals.user.assignments.push({ assignment: assignmentId })
    await res.locals.user.save()

    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/public/:assignmentId/hide', getUser, async (req, res) => {
  // Hides this public assignment for the current user
  // Requires authentication

  const { assignmentId } = req.params
  try {
    res.locals.user.hiddenAssignments.push(assignmentId)
    await res.locals.user.save()

    res.json({ success: true })  
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/:assignmentId/toggle', getUser, async (req, res) => {
  // Toggle the done state of assignment
  // Requires authentication

  const { assignmentId } = req.params
  try {
    const index = res.locals.user.assignments.findIndex(a => a.assignment == assignmentId)
    if (index === -1) {
      res.status(400).json({ error: 'No such assignment' })
      return
    }
    res.locals.user.assignments[index].done = !res.locals.user.assignments[index].done
    await res.locals.user.save()

    res.json({ success: true })    
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.patch('/:assignmentId', getUser, async (req, res) => {
  // Updates the assignment, creating a new private assignment if assignment was previously public
  // Requires authentication

  const { assignmentId } = req.params
  try {
    const index = res.locals.user.assignments.findIndex(a => a.assignment == assignmentId)
    if (index === -1) {
      res.status(400).json({ error: 'No such assignment' })
      return
    }
    
    const assignment = await Assignment.findById(assignmentId).lean()
    if (!assignment.public) {
      await Assignment.findByIdAndUpdate(assignmentId, req.body)
    } else {
      const { _id, ...oldAssignmentData } = assignment
      const newAssignment = await new Assignment({
        ...oldAssignmentData,
        ...req.body,
        public: false,
      }).save()
      res.locals.user.hiddenAssignments.push(_id)
      res.locals.user.assignments[index].assignment = newAssignment._id
      await res.locals.user.save()
    }

    res.json({ _id: res.locals.user.assignments[index].assignment })    
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.delete('/:assignmentId', getUser, async (req, res) => {
  // Delete assignment

  // Requires authentication

  const { assignmentId } = req.params
  try {
    const index = res.locals.user.assignments.findIndex(a => a.assignment == assignmentId)
    if (index === -1) {
      res.status(400).json({ error: 'No such assignment' })
      return
    }
    res.locals.user.assignments.splice(index, 1)

    // Remove assignment object if not public
    const assignment = await Assignment.findById(assignmentId)
    if (!assignment.public) {
      await Assignment.findByIdAndDelete(assignmentId)
    } else {
      res.locals.user.hiddenAssignments.push(assignmentId)
    }

    // Save user object
    await res.locals.user.save()

    // Socket communication
    emitToUser(res.locals.user._id, 'removeAssignment', assignmentId)

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router