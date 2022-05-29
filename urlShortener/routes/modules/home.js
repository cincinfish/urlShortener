const express = require('express')
const router = express.Router()
const shortener = require('../../public/javascript/shortener')
const { check, validationResult } = require('express-validator')

router.get('/', (req, res) => {
  res.render('index')
})
router.post('/', [
  check('url').isURL().withMessage('Please check your url'),
], (req, res) => {
  const fullUrl = req.body.url
  if (!fullUrl) {
    req.flash('info', 'Please check your url')
    return res.redirect('/')
  }
  const errors = validationResult(req)
  console.log(errors)
  if (!errors.isEmpty()) {
    return res.status(422).render('index', {
      errors: errors.array(),
      url: { fullUrl }
    })
  }


  res.render('index')

})

module.exports = router