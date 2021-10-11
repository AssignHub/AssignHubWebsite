import Vue from 'vue'
import store from '@/store'
import { socket } from '@/main'

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

export const inRange = (val, a, b) => {
  // Checks if val is in between a and b
  return a <= val && val <= b
} 

export const get = (route) => {
  return fetch(serverURL + route, {
    method: 'GET',
    credentials: 'include',
  }).then(res => res.json()).then(data => {
    if (data.error)
      throw data.error
    
    return data
  })
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
  return fetch(serverURL + route, {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  }).then(res => res.json()).then(data => {
    if (data.error)
      throw data.error
    
    return data
  })
}

export const getCurTerm = (terms) => {
  // Get current month and determine whether currently in spring, summer, or fall
  // 1 = spring, 2 = summer, 3 = fall

  // TODO: need to account for quarter system
  let month = new Date().getMonth()
  let year = new Date().getFullYear()
  if (inRange(month, 0, 4))
    return terms.find(t => t.text.toLowerCase().includes('spring'))
  else if (inRange(month, 5, 6))
    return terms.find(t => t.text.toLowerCase().includes('summer'))
  else
    return terms.find(t => t.text.toLowerCase().includes('fall'))
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