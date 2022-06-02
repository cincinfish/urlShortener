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
      errors: errors.array()
    })
  }
  const urlHost = `${req.protocol}://${req.header('host')}/`
  await shortUrl.findOne({ full: fullUrl })
    .lean()
    .then(url => {
      if (url) {
        return res.render('index', { url, urlHost: urlHost, short: url.short })
      }
      const shortUrlChars = shortener()
      shortUrl.create({
        full: fullUrl, short: shortUrlChars
      })
      url = { "full": fullUrl, "short": shortUrlChars }
      return res.render('index', { url, urlHost })
    })
    .catch(error => {
      console.log(error)
      res.render('index', { error: error.message })
    })
})

router.get('/:short', async (req, res) => {
  const short = req.params.short
  const shortenUrl = await shortUrl.findOne({ short }).lean()
  if (shortenUrl) {
    return res.redirect(shortenUrl.full)
  }
  res.sendStatus(404)
})

module.exports = router