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

// Returns a string for the day that the given date represents
// e.g. "08-09-2022"
export const getDayString = (date: Date): String => {
  return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().substring(0, 10)
}