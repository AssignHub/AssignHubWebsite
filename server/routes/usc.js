const express = require('express')
const router = express.Router()
const cron = require('node-cron')
const editJsonFile = require('edit-json-file')
const TROJAN = require('trojan-course-api')
const Class = require('../models/class')
const { getTerm } = require('../middleware/usc')
const { getUser } = require('../middleware/auth')
const { emitToUser } = require('../websockets')
const Assignment = require('../models/assignment')
require('../utils/object_utils')

// Cache terms daily with cron
const writeTermsToJson = async () => {
  console.log('========================================')
  console.log('-----------Updating USC Terms-----------')
  console.log('========================================')
  try {
    const terms = await TROJAN.terms().then(data => {
      return data.terms.map(term => { 
        term = '' + term
        const year = term.substring(0, 4)
        const seasons = ['Spring', 'Summer', 'Fall']
        const season = seasons[term.substring(4) - 1]
        return { term, text: `${season} ${year}` }
      })
    })
    let jsonFile = editJsonFile(`${__dirname}/../config/usc.json`)
    jsonFile.set('terms', terms)
    jsonFile.save()
  } catch (err) {
    console.error(err)
  }
}

const getTerms = () => {
  return editJsonFile(`${__dirname}/../config/usc.json`).toObject().terms
}

writeTermsToJson()
cron.schedule('0 0 * * *', () => {
  writeTermsToJson()
})

// Routes
router.get('/terms', (req, res) => {
  let terms = getTerms()
  res.json(terms)
})

router.post('/add-class', getUser, getTerm, async (req, res) => {
  // Requires authentication

  /* Query params:
  *  term - the desired term
  */

  /* Body params:
  *  courseId - the class's course id (e.g. BUAD-304)
  *  sectionId - the class's section id (e.g. 12345)
  *  color - the color, in hex format (e.g. #1fa3bc)
  */
  
  const { courseId, sectionId, color } = req.body
  let section;
  try {
    const options = { term: res.locals.term }
    section = await TROJAN.course(courseId, options).then(data => {
      return data.courses[courseId].sections[sectionId]
    })
  } catch (err) {
    // If course ID is wrong 
    res.status(404).json({ error: 'class-not-found' })
    return
  }

  try {
    if (!section) {
      // If section number is wrong
      res.status(404).json({ error: 'class-not-found' })
      return
    }

    if (section.type !== 'Lec') {
      // If not a lecture section
      res.status(400).json({ error: 'class-not-lec' })
      return
    }

    // Find class, create new one if doesn't exist
    let _class = await Class.findOne({ 
      term: res.locals.term,
      courseId, 
      sectionId,
    })

    if (!_class) {
      const classData = {
        term: res.locals.term,
        courseId,
        sectionId,
        instructor: {
          firstName: section.instructor.first_name,
          lastName: section.instructor.last_name,
        },
        blocks: section.blocks
      }
      _class = await new Class(classData).save()
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

    if (res.locals.user.classes.findIndex(e => e.class.term === res.locals.term && e.class.courseId === courseId) !== -1) {
      // If user already enrolled in a class that has same courseId
      res.status(400).json({ error: 'same-course-id' })
      return
    }

    res.locals.user.classes.push({ class: _class._id, color: color })
    await res.locals.user.save()

    const numMembers = await _class.findMembers().lean().countDocuments()
    emitToUser(res.locals.user._id, 'addClass', { ..._class.toJSON(), color: color, numMembers })

    res.status(201).json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/my-classes', getUser, async (req, res) => {
  // Requires authentication
  try {
    let terms = getTerms().map(t => t.term)

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

router.delete('/classes/:classId', getUser, async (req, res) => {
  // Deletes the requested class
  // Requires authentication

  const { classId } = req.params
  try {
    // Remove class
    const classIndex = res.locals.user.classes.findIndex(c => c.class == classId)
    if (classIndex !== -1)
      res.locals.user.classes.splice(classIndex, 1)
    
    // Remove assignments
    await res.locals.user.populate({
      path: 'assignments.assignment',
      select: 'class public'
    }).execPopulate()

    const toDelete = [] // Store assignments to delete forever (e.g. not public)
    res.locals.user.assignments = res.locals.user.assignments.filter(a => {
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

    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/classes/:classId/members', async (req, res) => {
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