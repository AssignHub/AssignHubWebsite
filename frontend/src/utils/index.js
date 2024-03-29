import Vue from 'vue'
import store from '@/store'
import { socket } from '@/main'
import { TUTORIAL_STEPS, BERKELEY_SEMESTERS } from '@/constants'

export const serverURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/api'
export const socketURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/'

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

export const daysBetween = (a, b) => {
  a = new Date(a)
  b = new Date(b)
  return Math.floor((a - b) / (1000 * 3600 * 24))
}

export const inRange = (val, a, b) => {
  // Checks if val is in between a and b
  return a <= val && val <= b
} 

export const get = (route) => {
  return fetchMethod('GET', route)
}

export const post = (route, body={}) => {
  return fetchMethod('POST', route, body)
}

export const patch = (route, body={}) => {
  return fetchMethod('PATCH', route, body)
}

export const _delete = (route, body={}) => {
  return fetchMethod('DELETE', route, body)
}

export const fetchMethod = (method, route, body={}) => {
  /* Calls the given route with the give method and body */
  const params = {
    method,
    credentials: 'include',
  }

  if (method !== 'GET') {
    // Add params specific to POST/PATCH/DELETE
    params.headers = {
      'Content-Type': 'application/json'
    }
    params.body = JSON.stringify(body)
  }

  return fetch(serverURL + route, params).then(async res => {
    // Parse data if it is json, otherwise just return an empty object
    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch (err) {
      return {}
    }
  }).then(data => {
    // Throw an error if one occurred
    if (data.error)
      throw data.error
    
    return data
  })
}

export const getCurTerm = () => {
  // Get current month and determine whether currently in spring, summer, or fall
  // 1 = spring, 2 = summer, 3 = fall

  // TODO: remove this hardcoded berkeley stuff
  if (store.state.authUser.school === 'berkeley') {
    return getBerkeleyTerm()
  }

  // TODO: need to account for quarter system
  let month = new Date().getMonth()
  let year = new Date().getFullYear()
  if (inRange(month, 0, 4))
    return store.state.terms.find(t => t.text.toLowerCase().includes('spring'))
  else if (inRange(month, 5, 6))
    return store.state.terms.find(t => t.text.toLowerCase().includes('summer'))
  else
    return store.state.terms.find(t => t.text.toLowerCase().includes('fall'))
}

export const getBerkeleyTerm = () => {
  // Gets the current term based on the current date and Berkeley semesters

  for (let i = 0; i < BERKELEY_SEMESTERS.length; i++) {
    let semester = BERKELEY_SEMESTERS[i]
    let d = new Date(semester.end + " 23:59:59")
    if (d > Date.now()) {
      return semester
    }
  }
}

export const stringReplaceByIndex = (origString, replaceString, beg, end) => {
  return origString.substring(0, beg) + replaceString + origString.substring(end)
}

export const socketReconnect = () => {
  socket.disconnect()
  socket.connect()
}

export const setNumDigits = (num, numDigits) => {
  // Converts a number to a certain number of digits by adding 0's to the front
  let numString = '' + num
  const extraDigits = numDigits - numString.length
  numString = (extraDigits > 0 ? '0'.repeat(extraDigits) : '') + numString
  return numString  
}

export const getDateString = (date) => {
  return date.getFullYear() + '-' + setNumDigits(date.getMonth() + 1, 2) + '-' + setNumDigits(date.getDate(), 2)
}

export const getTimeString = (date) => {
  return setNumDigits(date.getHours(), 2) + ':' + setNumDigits(date.getMinutes(), 2)
}

export const to12Hr = (time) => {
  if (!time) return ''

  const [ hour, min ] = time.split(':')
  let newHour;
  if (parseInt(hour) <= 11) {
    return time + ' AM'
  } else if (parseInt(hour) === 12) {
    newHour = parseInt(hour)
  } else {
    newHour = parseInt(hour) - 12
  }
  return newHour + ':' + min + ' PM'
}

export const blocksString = (_class) => {
  if (!_class.blocks)
    return 'N/A'
  if (_class.asynchronous)
    return 'Asynchronous'

  // Put slashes between days and convert H to TH
  const daysString = _class.blocks.map(block => {
    return block.day === 'H' ? 'TH' : block.day
  }).join('/')

  // Construct time string
  const { start, end } = _class.blocks[0]
  const timeString = to12Hr(start) + ' - ' + to12Hr(end)

  return daysString + ' | ' + timeString
}

export const instructorNames = (_class) => {
  if (!_class.instructors || _class.instructors.length === 0)
    return 'N/A'
  return _class.instructors.map(({ firstName, lastName }) => `${firstName} ${lastName}`).join(', ')
}

export const partition = (arr, filter) => {
  const pass = [], fail = []
  arr.forEach((e, i, arr) => (filter(e, i, arr) ? pass : fail).push(e))
  return [pass, fail]
}

export const showTutorial = (newUser) => {
  introJs()
    .setOptions({
      disableInteraction: true,
      showBullets: false,
      showStepNumbers: true,
      steps: newUser ? TUTORIAL_STEPS : TUTORIAL_STEPS.filter(s => !s.onlyNewUser),
    })
    .onbeforechange(function(element) {
      const curItem = this._introItems[this._currentStep]
      
      // Update school specific tutorial items
      if (curItem.hasOwnProperty('schoolSpecific')) {
        // Make sure school exists in school specific object
        const school = store.state.authUser.school
        if (curItem.schoolSpecific.hasOwnProperty(school)) {
          // Update all specified props
          for (const prop in curItem.schoolSpecific[school]) {
            curItem[prop] = curItem.schoolSpecific[school][prop]
          }
        }
      }
      
      switch (element.id) {
        case 'tut-add-assignment-btn':
          // Show the add assignment form
          document.getElementById('add-input-assignment-dialog').__vue__.show()
          break
        case 'tut-calendar':
          // Hide the add assignment form
          document.getElementById('add-input-assignment-dialog').__vue__.hide()
          break
      }
    })
    .start()
}

export const handleCredentialResponse = ({ credential }) => {
  store.dispatch('signInGoogle', credential)
}

export const sortAssignments = (a, b) => {
  /* Sorting function that sorts assignments first by due date, then by courseId */

  // First sort by time
  const timeDiff = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()

  // Then sort by course id
  if (timeDiff === 0) {
    // Return the other one first if courseId is undefined (to put tasks at the bottom), 
    // otherwise return the first courseId alphabetically
    const aId = a.class?.courseId
    const bId = b.class?.courseId
    if (!aId) return 1
    if (!bId) return -1
    return aId.localeCompare(bId)
  }
  return timeDiff
}

export const getClassColor = (courseId, classes=store.state.classes) => {
  /* Returns the color of a class based on its courseId */
  return classes.find(c => c.courseId === courseId && c.color)?.color
}

export const setActive = () => {
  /* Tells the server that the current user is active */
  return post('/general/set-active')
}

export const getDateInfo = (date) => {
  const d = new Date(date)
  
  return {
    seconds: d.getSeconds(),
    minutes: d.getMinutes(),
    hours: d.getHours(),
    day: d.getDay(),
    date: d.getDate(),
    month: d.getMonth(),
    year: d.getFullYear(),
    
    UTCSeconds: d.getUTCSeconds(),
    UTCMinutes: d.getUTCMinutes(),
    UTCHours: d.getUTCHours(),
    UTCDay: d.getUTCDay(),
    UTCDate: d.getUTCDate(),
    UTCMonth: d.getUTCMonth(),
    UTCYear: d.getUTCFullYear(),
  }
}

export const isPhone = (vuetify) => {
  return vuetify.breakpoint.name === 'xs'
}

export const br = (vuetify, breakpoint) => {
  return vuetify.breakpoint.name === breakpoint
}