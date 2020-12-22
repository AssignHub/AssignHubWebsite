const TROJAN = require('trojan-course-api')

//TROJAN.courses('MPVA', {term: '20203'}).then(console.log)

TROJAN.course('BUAD-304').then(data => {
  //console.log(data)
  console.log(data.courses['BUAD-304'].sections[14723])
  //console.log(data.departments.LING)
  //console.log(data.departments.ENGV.depts)
}).catch(err => console.log(err))

/*TROJAN.terms().then(data => {
  console.log( 
    data.terms.map(term => { 
      term = '' + term
      let year = term.substring(0, 4)
      let seasons = ['Spring', 'Summer', 'Fall']
      let season = seasons[term.substring(4) - 1]
      return { term, text: `${season} ${year}` }
    })
  )
})*/

//TROJAN.deptsN().then(console.log)

// need to implement: 
// Option to select which term you are currently in (turn 20203 into Fall 2020 for example)
// Autofill while searching, like webreg
  // to do this: 
  // When user clicks on search textfield, get .deptsN() and then filter that
  // when dept has been confirmed, get the courses in the dept with .courses()
  // when specific course is confirmed, show the sections in that course and prompt user to pick

//IDEA:
// When user decides to publish assignment and it's very similar in name to another assignment, it asks if they want to merge the assignment with an already existing one
// Can also view crowdsourced assignments by CLASS, by PROFESSOR and also by SECTION  