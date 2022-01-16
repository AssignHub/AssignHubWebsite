const editJsonFile = require('edit-json-file')
const TROJAN = require('trojan-course-api')
const appRoot = require('app-root-path')

// Cache terms daily with cron
exports.writeTermsToConfig = async () => {
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
    let jsonFile = editJsonFile(`${appRoot}/config/usc.json`)
    jsonFile.set('terms', terms)
    jsonFile.save()
  } catch (err) {
    console.error(err)
  }
}

exports.getTerms = () => {
  return editJsonFile(`${appRoot}/config/usc.json`).toObject().terms
}

exports.getInstructors = (section) => {
  /* Returns an array of instructors based on whether there is a single instructor or there are multiple */
  const instructors = []
  if (section.instructor) {
    if (section.instructor.hasOwnProperty('length')) {
      // instructor prop is an array of multiple instructors
      section.instructor.forEach(instructor => instructors.push({
        firstName: instructor.first_name,
        lastName: instructor.last_name,
      }))
    } else {
      // instructor prop contains a single instructor
      instructors.push({
        firstName: section.instructor.first_name,
        lastName: section.instructor.last_name,
      })
    }
  }

  return instructors
}