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
], async (req, res) => {

  const fullUrl = req.body.url ? req.body.url : ''
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).render('index', {
      errors: errors.array(),
      url: { fullUrl }
    })
  }

  await shortUrl.find({ full: fullUrl })
    .lean()
    .then(url => {
      if (url[0]) {
        return res.render('index', { url, short: url.short })
      }
      const shortUrlChars = shortener()
      shortUrl.create({
        full: fullUrl, short: shortUrlChars
      })
      return res.render('index', { short: shortUrlChars })
    })
    .catch(error => {
      console.log(error)
      res.render('index', { error: error.message })
    })
})

router.get('/:short', async (req, res) => {
  const short = req.params.short
  const shortenUrl = await shortUrl.findOne({ short }).lean()
  if (shortenUrl === null) {
    return res.sendStatus(404)
  }
  res.redirect(shortenUrl.full)
})

module.exports = router