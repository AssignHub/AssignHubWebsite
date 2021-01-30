Object.filter = (obj, condition) => {
  let result = {}, key

  for (key in obj) {
    if (obj.hasOwnProperty(key) && condition(obj[key])) {
      result[key] = obj[key]
    }
  }

  return result
}

Object.map = (obj, mapFunction) => {
  let result = {}, key

  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = mapFunction(obj[key])
    }
  }

  return result
}