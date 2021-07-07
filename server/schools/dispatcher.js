exports.getSchoolMiddleware = (middlewareName) => {
  // returns the middleware function `middlewareName` for the user's respective school

  return (req, res, next) => {
    try {
      const school = res.locals.user.school
      if (!school) {
        res.status(400).json({ error: 'no-school' })
        return
      }
      require(`./${res.locals.user.school}`).middleware[middlewareName](req, res, next)
    } catch (err) {
      console.error(err)
      res.status(500).json({ error: err })
    }
  }
}

exports.getSchoolUtilFunction = (res, funcName) => {
  // returns the util function `funcName` for the user's respective school
  
  try {
    const school = res.locals.user.school
    if (!school) {
      res.status(400).json({ error: 'no-school' })
      return
    }
    return require(`./${res.locals.user.school}`).utils[funcName]
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
}