const appRoot = require('app-root-path')
const reqlib = appRoot.require
const editJsonFile = require('edit-json-file')
const { getDirectories } = reqlib('utils/utils')

let emailsMap = null

exports.getEmailsMap = () => emailsMap

exports.init = () => {
  // Creates a map mapping hardcoded emails to the school that they go to (in the case where students don't have school emails)
  emailsMap = new Map()

  getDirectories(__dirname).then(schools => {
    for (const school of schools) {
      const emails = editJsonFile(`${appRoot}/schools/${school}/allowed_emails.json`)?.toObject()
      if (emails && emails.hasOwnProperty('length')) {
        for (const email of emails) {
          emailsMap.set(email, school)
        }
      }
    }
  })
}