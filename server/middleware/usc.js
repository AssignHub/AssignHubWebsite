exports.getTerm = (req, res, next) => {
  if (!req.query.term) {
    res.status(400).json({error: 'The term query param is required!'})
    return 
  } else {
    res.locals.term = req.query.term
    next()
  }
}