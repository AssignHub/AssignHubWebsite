const express = require('express')
const router = express.Router()
const reqlib = require('app-root-path').require
const Class = reqlib('/models/class')
const Assignment = reqlib('/models/assignment')
const { getTerm } = reqlib('/middleware/general')
const { getUser } = reqlib('/middleware/auth')
const { emitToUser } = reqlib('/websockets')
const { getSchoolMiddleware, getSchoolUtilFunction } = reqlib('/schools/dispatcher')

router.get('/terms', getUser, (req, res) => {
  let terms = getSchoolUtilFunction(res, 'getTerms')()
  res.json(terms)
})

router.post('/set-term', getUser, async (req, res) => {
  /* Sets the user's currently selected term */

  /* Body params:
   * term - the term to set the user's curSelectedTerm to
   */

  const { term } = req.body

  try {
    res.locals.user.curSelectedTerm = term
    await res.locals.user.save()

    res.end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/search', getUser, getTerm, getSchoolMiddleware('searchClass'), async (req, res) => {
  /* Returns an array containing class results for the specified query */

  /* Query params: 
   * query - the search query
   */

  res.json(res.locals.searchClassResults)
})

router.get('/sections', getUser, getTerm, getSchoolMiddleware('getSections'), async (req, res) => {
  /* Returns an array containing all the sections of the specified courseId, as well as all the sections
   * currently enrolled in for the given courseId and term  
   */

  /* Query params:
  *  courseId - the courseId to search
  *  term - the desired term
  */
  const { term, courseId } = req.query

  try {
    // Populate classes and nonLectureSections
    await res.locals.user.populate({
      path: 'classes.class',
      select: 'term courseId sectionId',
    }).populate({
      path: 'nonLectureSections.class',
      select: 'term courseId sectionId',
    }).execPopulate()

    // Get the section ids of the sections currently enrolled in for the given courseId and term
    const enrolledSections = [
      ...res.locals.user.classes.filter(({ class: section }) => {
        return section.term === term && section.courseId === courseId
      }),
      ...res.locals.user.nonLectureSections.filter(({ class: section }) => {
        return section.term === term && section.courseId === courseId
      })
    ]
    const enrolledSectionIds = enrolledSections.map(s => s.class.sectionId)

    // Get the currently selected color if there are enrolled sections 
    const color = enrolledSections.find(s => s.color)?.color

    res.json({ sections: res.locals.classSections, enrolledSectionIds, color })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/add', getUser, getTerm, getSchoolMiddleware('addClass'), async (req, res) => {
  // Requires authentication

  /* Query params:
  *  term - the desired term
  */

  /* Body params:
  *  IS UNIQUE TO EACH SCHOOL, check a school's specific middleware for more details
  *  color - the color, in hex format (e.g. #1fa3bc)
  */

  const { color } = req.body

  try {
    const _class = res.locals.class

    await res.locals.user.populate({
      path: 'classes.class',
      select: 'courseId term'
    }).execPopulate()

    if (res.locals.user.classes.filter(e => e.class._id.equals(_class._id)).length > 0) {
      // If user already enrolled in class
      res.status(400).json({ error: 'already-in-class' })
      return
    }

    if (res.locals.user.classes.findIndex(e => e.class.term === res.locals.term && e.class.courseId === _class.courseId) !== -1) {
      // If user already enrolled in a class that has same courseId
      res.status(400).json({ error: 'same-course-id' })
      return
    }

    res.locals.user.classes.push({ class: _class._id, color: color })
    await res.locals.user.save()

    const numMembers = await _class.findMembers().lean().countDocuments()
    emitToUser(res.locals.user._id, 'addClass', { ..._class.toJSON(), color: color, numMembers })

    res.status(201).json({ courseId: _class.courseId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/add-sections', getUser, async (req, res) => {
  /* Adds the given sections to either the user's classes or nonLectureSections array depending on whether the section is a Lecture section or not */

  /* Body params:
  *  sections - an array of class sections to add, the format of which is
  *  [{
  *    term: String,
  *    courseId: String,
  *    sectionId: String,
  *    type: String['Lecture', 'Discussion', 'Lab', 'Quiz'],
  *    blocks: [{ day: String, start: String, end: String, location: String }],
  *    instructors: [{ firstName: String, lastName: String }],
  *  }]
  *  color - the color, in hex format (e.g. #1fa3bc)
  */
  
  const { sections, color } = req.body
  try {
    // Add each section to the correct array (classes or nonLectureSections)
    let lectureSection
    for (const { term, courseId, sectionId, type, blocks, instructors } of sections) {
      // Find class document if it exists or create a new one
      let _class = await Class.findOne({ 
        term,
        courseId, 
        sectionId,
      })

      if (!_class) {
        _class = await new Class({
          term,
          courseId,
          sectionId,
          instructors,
          blocks,
        }).save()
      }

      // Add section to user object
      if (type === 'Lecture') {
        lectureSection = _class
        res.locals.user.classes.push({ class: _class._id, color: color })
      } else {
        res.locals.user.nonLectureSections.push({ class: _class._id })
      }
    }
    await res.locals.user.save()
    
    // If lecture section was added, emit add class socket event
    if (lectureSection) {
      const numMembers = await lectureSection.findMembers().lean().countDocuments()
      emitToUser(res.locals.user._id, 'addClass', { ...lectureSection.toJSON(), color: color, numMembers })
    }

    res.end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/remove-sections', getUser, async (req, res) => {
  /* Adds the given sections to either the user's classes or nonLectureSections array depending on whether the section is a Lecture section or not */

  /* Body params:
  *  sections - an array of class sections to remove, the format of which is
  *  [{
  *    term: String,
  *    courseId: String,
  *    sectionId: String,
  *    type: String['Lecture', 'Discussion', 'Lab', 'Quiz'],
  *  }]
  */ 

  const { sections } = req.body
  try {
    // Populate classes and nonLectureSections
    await res.locals.user.populate({
      path: 'classes.class',
      select: 'courseId sectionId term'
    }).populate({
      path: 'nonLectureSections.class',
      select: 'courseId sectionId term'
    }).execPopulate()

    // Remove the specified sections
    let lectureClassId = '' // Is set to the classId of the lecture, if there is a lecture section
    for ( const { term, courseId, sectionId, type } of sections ) {
      const curSections = type === 'Lecture' ? res.locals.user.classes : res.locals.user.nonLectureSections
      const indexToRemove = curSections.findIndex(s => s.class.term === term && s.class.courseId === courseId && s.class.sectionId === sectionId)

      if (type === 'Lecture') lectureClassId = curSections[indexToRemove].class._id
      curSections.splice(indexToRemove, 1)
    }
    await res.locals.user.save()

    // If lecture was removed, emit remove class socket event
    if (lectureClassId)
      emitToUser(res.locals.user._id, 'removeClass', lectureClassId)

    res.end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/join', getUser, getTerm, async (req, res) => {
  // Requires authentication
  // Lets user join an existing class

  /* Query params:
  *  term - the desired term
  */

  /* Body params:
  *  IS UNIQUE TO EACH SCHOOL, check a school's specific middleware for more details
  *  color - the color, in hex format (e.g. #1fa3bc)
  */

  const { color, classId } = req.body

  try {

    const _class = await Class.findById(classId)

    if (!_class) {
      res.status(400).json({ error: 'class-not-found' })
      return
    }

    await res.locals.user.populate({
      path: 'classes.class',
      select: 'courseId term'
    }).execPopulate()

    if (res.locals.user.classes.filter(e => e.class._id.equals(_class._id)).length > 0) {
      // If user already enrolled in class
      res.status(400).json({ error: 'already-in-class' })
      return
    }

    if (res.locals.user.classes.findIndex(e => e.class.term === res.locals.term && e.class.courseId === _class.courseId) !== -1) {
      // If user already enrolled in a class that has same courseId
      res.status(400).json({ error: 'same-course-id' })
      return
    }

    res.locals.user.classes.push({ class: _class._id, color: color })
    await res.locals.user.save()

    const numMembers = await _class.findMembers().lean().countDocuments()
    emitToUser(res.locals.user._id, 'addClass', { ..._class.toJSON(), color: color, numMembers })

    res.status(201).json({ courseId: _class.courseId })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

// TODO: need to return nonLectureSections as well
router.get('/mine', getUser, async (req, res) => {
  // Requires authentication
  try {
    let terms = getSchoolUtilFunction(res, 'getTerms')().map(t => t.term)

    await res.locals.user.populate({
      path: 'classes.class',
      match: { term: { $in: terms } }
    }).execPopulate()

    const formatClass = async (c) => {
      const numMembers = await c.class.findMembers().lean().countDocuments()
      c = c.toJSON()
      const { _id, class: classData, ...rest } = c
      return { ...classData, ...rest, numMembers }
    } 

    let classes = await res.locals.user.classes.filter(c => c.class !== null)
    classes = await Promise.all(classes.map((c) => formatClass(c)))

    res.json(classes)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/get/:courseId', getUser, getTerm, async (req, res) => {
  // Requires authentication
  const { courseId } = req.params

  try {

    let chosenClass = null;

    if (courseId.length == 24) {
      chosenClass = await Class.findById(courseId)
    }

    if (!chosenClass) {
      res.status(400).json({ error: 'class-not-found' })
      return
    }

    res.json(chosenClass)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.delete('/:classId', getUser, async (req, res) => {
  // Deletes the requested class
  // Requires authentication

  const { classId } = req.params
  try {
    // Remove class
    const classIndex = res.locals.user.classes.findIndex(c => c.class == classId)
    if (classIndex !== -1) {
      // Populate classes and nonLectureSections
      await res.locals.user.populate({
        path: 'nonLectureSections.class',
        select: 'term courseId'
      }).populate({
        path: 'classes.class',
        select: 'term courseId'
      }).execPopulate()

      const { courseId, term } = res.locals.user.classes[classIndex].class
      
      // Filter out the nonLectureSections with the same term and courseId
      res.locals.user.nonLectureSections = res.locals.user.nonLectureSections.filter(({ class: section }) => {
        const keep = !(section.term === term && section.courseId === courseId)
        return keep
      })

      // Remove class from classes array
      res.locals.user.classes.splice(classIndex, 1)
    }
    
    // Remove assignments
    await res.locals.user.populate({
      path: 'assignments.assignment',
      select: 'class public'
    }).execPopulate()

    // Filter assignments array, deleting assignment documents if they aren't public
    const toDelete = [] // Store assignments to delete forever (e.g. not public)
    res.locals.user.assignments = res.locals.user.assignments.filter(a => {
      if (!a.assignment.class)
        return true

      const remove = a.assignment.class.equals(classId)
      if (remove) {
        if (!a.assignment.public) {
          toDelete.push(a.assignment._id)
        } else {
          res.locals.user.hiddenAssignments.push(a.assignment._id)
        }
      }
      return !remove
    })

    for (let id of toDelete) {
      await Assignment.findByIdAndDelete(id)
    }
    
    await res.locals.user.save()

    emitToUser(res.locals.user._id, 'removeClass', classId)

    res.end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/:classId/members', async (req, res) => {
  // Gets the members in this class
  // Requires authentication

  const { classId } = req.params
  try {
    const _class = await Class.findById(classId)
    const members = await _class.findMembers()
      .lean()
      .select('firstName lastName email pic')
      .sort({ lastName: 1, firstName: 1, email: 1 })

    res.json(members)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router