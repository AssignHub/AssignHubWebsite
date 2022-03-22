const appRoot = require('app-root-path')
const reqlib = appRoot.require
const editJsonFile = require('edit-json-file')
const { getDirectories } = reqlib('utils/utils')

let emailsMap = null

exports.getEmailsMap = () => emailsMap

exports.init = () => {
  emailsMap = new Map()

  getDirectories(__dirname).then(schools => {
    for (const school of schools) {
      const emails = editJsonFile(`${appRoot}/config/${school}.json`)?.toObject().allowedEmails
      if (emails) {
        for (const email of emails) {
          emailsMap.set(email, school)
        }
      }
    }
  })
}