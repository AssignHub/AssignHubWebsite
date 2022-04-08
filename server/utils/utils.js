const fetch = require('node-fetch')
const { promises: { readdir } } = require('fs')
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

exports.getDirectories = async (path) => {
  return (await readdir(path, { withFileTypes: true }))
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
}

exports.compareDateDay = (a, b) => {
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