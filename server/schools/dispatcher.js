exports.getSchoolMiddleware = (middlewareName) => {
  // returns the middleware function `middlewareName` for the user's respective school

  return (req, res, next) => {
    try {
      let school = res.locals.user.school
      if (!school) {
        res.status(400).json({ error: 'no-school' })
        return
      }
      // TODO: REMOVE THIS TEST CODE
      if (school === 'gmail') school = 'berkeley'

      require(`./${school}`).middleware[middlewareName](req, res, next)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: err })
    }
  }
}

exports.getSchoolUtilFunction = (res, funcName) => {
  // returns the util function `funcName` for the user's respective school
  
  try {
    let school = res.locals.user.school
    if (!school) {
      res.status(400).json({ error: 'no-school' })
      return
    }
    // TODO: REMOVE THIS TEST CODE
    if (school === 'gmail') school = 'berkeley'

    return require(`./${school}`).utils[funcName]
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
}