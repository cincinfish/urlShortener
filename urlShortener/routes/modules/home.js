const express = require('express')
const router = express.Router()
const shortener = require('../../public/javascript/shortener')
const { check, validationResult } = require('express-validator')
const shortUrl = require('../../models/shortUrl')

router.get('/', (req, res) => {
  res.render('index')
})
router.post('/', [
  check('url').isURL().withMessage('Please check your url'),
], (req, res) => {
  const fullUrl = req.body.url
  if (!fullUrl) {
    res.redirect('index')
  }
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('index', {
      errors: errors.array(),
      url: { fullUrl }
    })
  }

  shortUrl.find({ full: fullUrl })
    .lean()
    .then(url => {
      if (url) {
        return res.render('index', { fullUrl, short })
      }
      const short = shortener()
      shortUrl.create({
        full: fullUrl, short
      })
      return res.render('index', { fullUrl, short })
        .catch(error => {
          console.log(error)
          res.render('index', { error: error.message })
        })
    })
})

module.exports = router