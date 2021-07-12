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