const reqlib = require('app-root-path').require
const { inRange } = reqlib('utils/utils')

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
    const curSemesterId = curSemester === 'Spring' ? 1 : curSemester === 'Summer' ? 2 : 3 
    const term = `${curYear}${curSemesterId}`
    
    terms.push({
      text: termText,
      term,
    })
  }
  return terms
}