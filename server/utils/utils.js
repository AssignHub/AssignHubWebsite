const fetch = require('node-fetch')
require('dotenv').config()

exports._fetch = (path, options) => fetch(path, options)
  .then(res => res.json())
  .then(data => {
    if (data.error)
      throw data

    return data
  })

exports.escapeRegExp = (string)=> {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

exports.inRange = (val, a, b) => {
  // Checks if val is in between a and b
  return a <= val && val <= b
}

exports.splitLast = (string, char=' ') => {
  /* Returns an array containing the string split into two parts, 
   * the beginning of string up until the last occurence of char, and the
   * latter part from last occurence of char to the end of string 
   */

  const lastIndex = string.lastIndexOf(char)
  if (lastIndex === -1) return [ string ]
  return [string.substring(0, lastIndex), string.substring(lastIndex+1)]
}