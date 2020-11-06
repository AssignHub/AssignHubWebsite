const TROJAN = require('trojan-course-api')

export const createUUID = () => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0
      dt = Math.floor(dt/16)
      return (c=='x' ? r :(r&0x3|0x8)).toString(16)
  })
  return uuid
}

export const compareDateDay = (a, b) => {
  // returns -1 if a is before b, 1 if a is after b, 0 otherwise
  a = new Date(a)
  b = new Date(b)
  if (a.getFullYear() !== b.getFullYear()) {
    return a.getFullYear() - b.getFullYear()
  } else if (a.getMonth() !== b.getMonth()) {
    return a.getMonth() - b.getMonth()
  } else {
    return a.getDate() - b.getDate()
  }
}

export const getTerms = () => {
  return TROJAN.terms().then(data => {
    return data.terms.map(term => { 
      term = '' + term
      let year = term.substring(0, 4)
      let seasons = ['Spring', 'Summer', 'Fall']
      let season = seasons[term.substring(4) - 1]
      return { term, text: `${season} ${year}` }
    })
  })
}

export const getAllDepartments = (term) => {
  return TROJAN.deptsN({ term }).then(data => data.departments)
}

export const getCourses = (dept, term) => {
  return TROJAN.courses(dept, { term }).then(data => data.courses)
}

export const getSections = (courseId, term) => {
  return TROJAN.course(courseId, { term }).then(data => data.courses[courseId].sections)
}