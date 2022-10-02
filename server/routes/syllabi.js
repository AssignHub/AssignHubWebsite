const reqlib = require('app-root-path').require
const router = require('express').Router()
const { uploadSyllabus } = reqlib('drive_uploader')
const { getUser } = reqlib('middleware/auth')
const { sendMessage } = reqlib('discord_bot')

router.post('/upload', getUser, async (req, res) => {
  /* Body params:
  *  classId - the classId of the class to upload a syllabus for
  */
  const { classId, comment } = req.body

  try {
    const files = req.files.file
    await uploadSyllabus(res.locals.user, classId, files, comment)
    res.end()
  } catch (err) {
    sendMessage(`:x: There was an ERROR uploading a syllabus! Check if refresh token has expired :x:`)
    console.error(err)
    res.status(500).json({ error: err })
  }
})

module.exports = router