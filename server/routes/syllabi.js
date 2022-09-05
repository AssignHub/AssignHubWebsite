const reqlib = require('app-root-path').require
const router = require('express').Router()
const { uploadSyllabus } = reqlib('drive_uploader')
const { getUser } = reqlib('middleware/auth')

router.post('/upload', getUser, async (req, res) => {
  /* Body params:
  *  classId - the classId of the class to upload a syllabus for
  */
  const { classId, comment } = req.body

  try {
    await uploadSyllabus(res.locals.user, classId, req.files.file, comment)
    res.end()
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router