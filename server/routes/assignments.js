// TODO: catch error if req.body is wrong

const express = require('express')
const router = express.Router()
const { emitToUser } = require('../websockets')
const Assignment = require('../models/assignment')
const Class = require('../models/class')
const { getUser, checkIsDev } = require('../middleware/auth')

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
      .filter(a => a.assignment && (a.assignment.class || a.assignment.noClass))
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

router.get('/dev/public', getUser, checkIsDev, async (req, res) => {
  /* Get all public assignments for the given class */

  const { classId } = req.query
  try {
    const publicAssignments = await Assignment.find({
      public: true,
      class: classId,
    }).populate({
      path: 'class',
      select: 'courseId sectionId',
    }).populate({
      path: 'creator',
      select: 'firstName lastName email',
    }).lean()

    res.json(publicAssignments)
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

router.post('/dev/create', getUser, checkIsDev, async (req, res) => {
  /* Creates a new public assignment for the given classId but doesn't add it to the user's assignments array */

  const {classId, name, dueDate } = req.body

  try {
    const assignmentData = {
      creator: res.locals.user._id, 
      class: classId, 
      name, 
      dueDate, 
      public: true,
    }

    const _class = await Class.findById(classId)

    if (!_class) {
      res.status(400).json({ error: 'invalid-class' })
      return
    }

    // Create assignment and add it to all members' assignment lists 
    const assignment = await new Assignment(assignmentData).save()
    const users = await _class.findMembers()
    for (const user of users) {
      user.assignments.push({assignment: assignment._id})
      await user.save()

      // Socket communication
      const assignmentPopulated = await assignment.populate({
        path: 'class',
        select: 'courseId',
      }).execPopulate()
      emitToUser(user._id, 'addAssignment', { ...assignmentPopulated.toJSON(), done: false })
    }

    res.status(201).end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/create', getUser, async (req, res) => {
  // Create a new assignment

  // Requires authentication

  /* Body params:
  *  classId - ObjectId of the class the assignment is associated with ('no-class' means it's a task not associated with a class)
  *  name - name of assignment
  *  dueDate - due date of assignment
  *  public - whether assignment is public (shared with everybody in your class)
  */
  const {classId, name, dueDate, public} = req.body

  try {
    const assignmentData = {
      creator: res.locals.user._id, 
      class: classId, 
      name, 
      dueDate, 
      public
    }

    // Only check if class exists if class id is not no-class
    if (classId !== 'no-class') {
      const _class = await Class.findById(classId)

      if (!_class) {
        res.status(400).json({ error: 'invalid-class' })
        return
      }
    } else {
      // classId is no-class!
      assignmentData.noClass = true
      assignmentData.public = false // Ensure no-class assignment is not public
      delete assignmentData.class
    }

    const assignment = await new Assignment(assignmentData).save()

    res.locals.user.assignments.push({assignment: assignment._id})
    await res.locals.user.save()

    // Socket communication
    const assignmentPopulated = await assignment.populate({
      path: 'class',
      select: 'courseId',
    }).execPopulate()
    emitToUser(res.locals.user._id, 'addAssignment', { ...assignmentPopulated.toJSON(), done: false })

    res.status(201).end()
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

    res.status(201).end()
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

    res.end()  
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

    res.end()    
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.patch('/dev/:assignmentId', getUser, checkIsDev, async (req, res) => {
  /* 
    Updates the assignment, even if it's a public assignment, and even if the user does not have the assignment
    in their assignments array. 
  */

  const { assignmentId } = req.params
  try {
    const assignmentData = req.body

    await Assignment.findByIdAndUpdate(assignmentId, assignmentData)

    res.status(200).end()
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
    // Check if assignment exists in user document
    const index = res.locals.user.assignments.findIndex(a => a.assignment == assignmentId)
    if (index === -1) {
      res.status(400).json({ error: 'No such assignment' })
      return
    }

    const assignmentData = req.body
    
    // Update assignment object if class is no-class or not
    if (assignmentData.class === 'no-class') {
      assignmentData.noClass = true
      assignmentData.class = undefined
    } else {
      assignmentData.noClass = false
    }

    // Update assignment based on whether it's public or not
    const assignment = await Assignment.findById(assignmentId).lean()
    if (!assignment.public) {
      await Assignment.findByIdAndUpdate(assignmentId, assignmentData)
    } else {
      // If assignment is public, create a new edited non-public assignment with updated properties
      const { _id, ...oldAssignmentData } = assignment
      const newAssignment = await new Assignment({
        ...oldAssignmentData,
        ...assignmentData,
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

router.delete('/dev/:assignmentId', getUser, checkIsDev, async (req, res) => {
  /* 
    Deletes assignment, even if it's public, even if the user doesn't have the assignment 
    in their assignments array
  */

  const { assignmentId } = req.params
  try {
    const assignment = await Assignment.findByIdAndDelete(assignmentId)
    const _class = await Class.findById(assignment.class)

    // Send socket message
    const users = await _class.findMembers()
    for (const user of users) {
      emitToUser(user._id, 'removeAssignment', assignment._id)
    }

    res.end()
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

    res.end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router