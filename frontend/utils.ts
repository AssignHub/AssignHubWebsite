export const serverURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/api'
export const socketURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '/'

// Returns whether the dates are the same
export const isSameDay = (a: Date, b: Date): boolean => {
  return compareDateDay(a, b) === 0
}

// Returns -1 if a is less than b, 1 if a is greater than b, 0 otherwise
export const compareDateDay = (a: Date, b: Date): number => {
  if (a.getFullYear() !== b.getFullYear()) {
    return a.getFullYear() - b.getFullYear()
  } else if (a.getMonth() !== b.getMonth()) {
    return a.getMonth() - b.getMonth()
  } else {
    return a.getDate() - b.getDate()
  }
}

export const getDateWithDayOffset = (date: Date, offset: number): Date => {
  return new Date(date.setDate(date.getDate() + offset))
}

// Returns a string for the day that the given date represents
// e.g. "2022-08-09"
export const getDayString = (date: Date): string => {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0, 10)
}

// Returns a uuid
export const createUUID = (): string => {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
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
  const params: Record<string, any> = {
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