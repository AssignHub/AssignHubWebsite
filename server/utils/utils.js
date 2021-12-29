const fetch = require('node-fetch')
require('dotenv').config()

const _fetch = (path, options) => fetch(path, options)
  .then(res => res.json())
  .then(data => {
    if (data.error)
      throw data

    return data
  })

const escapeRegExp = (string)=> {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

const inRange = (val, a, b) => {
  // Checks if val is in between a and b
  return a <= val && val <= b
} 

module.exports = { _fetch, escapeRegExp, inRange }