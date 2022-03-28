const reqlib = require('app-root-path').require
const appRoot = require('app-root-path')
const { escapeRegExp } = reqlib('utils/utils')
const editJsonFile = require('edit-json-file')

exports.searchClass = async(req, res, next) => {
  /* Sets `res.locals.searchClassResults` to an array of all courseIds that match the given search `query` */

  const { query } = req.query

  try {
    const classes = editJsonFile(`${appRoot}/schools/waldorf/classes.json`).toObject().classes

    // Construct a regex expression where "adsf" becomes "a.*s.*d.*f"
    const r = escapeRegExp(query.replace(' ', '')).split('').join('.*')
    const queryRegex = new RegExp(r, 'i')

    res.locals.searchClassResults = []
    for (const c of classes) {
      if (queryRegex.test(c.courseId)) {
        res.locals.searchClassResults.push(c.courseId)
      }
    }

    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
}

exports.getSections = async (req, res, next) => {
  /* Sets res.locals.classSections to an array containing all the sections of the specified courseId */
  // getTerm must be called before this middleware

  /* Query params:
  *  courseId - the courseId to search
  */

  const { courseId } = req.query
  try {
    const classes = editJsonFile(`${appRoot}/schools/waldorf/classes.json`).toObject().classes
    const filteredClasses = classes.filter(c => c.courseId.toLowerCase() === courseId.toLowerCase())

    if (filteredClasses.length === 0) {
      // Course ID is wrong
      res.status(404).json({ error: 'class-not-found' })
      return
    }
    
    const sections = filteredClasses.map(s => {
      return {
        ...s,
        term: res.locals.term,
      }
    })
    
    res.locals.classSections = sections

    next()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
}