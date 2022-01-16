const reqlib = require('app-root-path').require
const editJsonFile = require('edit-json-file')
const axios = require('axios')
const appRoot = require('app-root-path')
const { inRange } = reqlib('utils/utils')

// Cache classes daily with cron
exports.writeClassesToConfig = async () => {
  console.log('========================================')
  console.log('-----------Updating Berkeley Classes-----------')
  console.log('========================================')
  try {
    const classes = new Map()
    const data = await axios.get("https://berkeleytime.com/api/catalog/catalog_json/").then(response => response.data.courses)
    data.forEach(c => classes.set(c.abbreviation + " " + c.course_number, c.id));
    let jsonFile = editJsonFile(`${appRoot}/config/berkeley.json`)
    jsonFile.set('classes', JSON.stringify(Array.from(classes.entries())))
    jsonFile.save()
  } catch (err) {
    console.error(err)
  }
}

exports.getClasses = () => {
  return new Map(JSON.parse(editJsonFile(`${appRoot}/config/berkeley.json`).toObject().classes))
}

exports.getTerms = () => {
  let month = new Date().getMonth()
  let year = new Date().getFullYear()
  
  let order = []
  if (inRange(month, 0, 4)) {
    // Currently spring semester
    order = [`Fall ${year-1}`, `Spring ${year}`, `Summer ${year}`]
  } else if (inRange(month, 5, 6)) {
    // Currently summer semester
    order = [`Spring ${year}`, `Summer ${year}`, `Fall ${year}`,]
  } else {
    // Currently fall semester
    order = [`Summer ${year}`, `Fall ${year}`, `Spring ${year+1}`, ]
  }

  const terms = []
  for (let termText of order) {
    const [curSemester, curYear] = termText.split(' ')
    const curSemesterId = curSemester === 'Spring' ? 2 : curSemester === 'Summer' ? 5 : 8 
    const term = `${curYear.substring(0, 1)}${curYear.substring(2)}${curSemesterId}`
    
    terms.push({
      text: termText,
      term,
    })
  }
  return terms
}

