const router = require('express').Router()
const User = require('../models/user')
const { getUser } = require('../middleware/auth')

router.get('/mine', getUser, async (req, res) => {
  // Requires authentication

  try {
    await res.locals.user.friends.populate({
      path: 'friends',
      select: 'firstName lastName email pic mood'
    }).execPopulate()

    res.json(res.locals.user.friends)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.get('/search', /*getUser,*/ async (req, res) => {
  // Search for friend by name or email
  // Requires authentication

  /* Query params:
  *  query - the search query
  */

  let { query } = req.query
  query = decodeURIComponent(query)
  const queryTermsRegex = query.split(' ').map(term => new RegExp(term, 'i'))

  try {
    // TODO: fix so it doesn't show stopmotionpeps if I search "Jonathan L"
    const users = await User.find({
      $or: [
        { firstName: { $in: queryTermsRegex } },
        { lastName: { $in: queryTermsRegex } },
        { email: { $in: queryTermsRegex } },
      ]
    }, 'firstName lastName email pic') 

    console.log('queryterms', queryTermsRegex)
    console.log('USERS: ', users)

    res.json(users)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err })
  }
})

router.post('/add', getUser, async (req, res) => {

})

module.exports = router