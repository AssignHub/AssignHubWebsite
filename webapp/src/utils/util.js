const serverURL = 'http://localhost:3000'

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
  }).then(res => res.json()).then(data => {
    if (data.error)
      throw data.error
    
    return data
  })
}

export const post = (route, body) => {
  return fetch(serverURL + route, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  }).then(res => res.json()).then(data => {
    if (data.error)
      throw data.error
    
    return data
  })
}

export const getCurTerm = () => {
  // Get current month and determine whether currently in spring, summer, or fall
  // 1 = spring, 2 = summer, 3 = fall
  let month = new Date().getMonth()
  let year = new Date().getFullYear()
  if (inRange(month, 0, 4))
    return year + '1'
  else if (inRange(month, 5, 6))
    return year + '2'
  else
    return year + '3'
}