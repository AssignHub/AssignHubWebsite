exports.getTerm = (req, res, next) => {
  if (!req.query.term) {
    res.status(400).json({error: 'The query param "term" is required!'})
    return 
  } else {
    res.locals.term = req.query.term
    next()
  }
}