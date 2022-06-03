const shortUrl = require("../../models/shortUrl")

async function shortener() {
  const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'
  let newUrl = ''
  for (let i = 0; i < 5; i++) {
    newUrl += chars.charAt(Math.floor(Math.random() * chars.length))
    await shortUrl.findOne({ short: newUrl })
      .lean()
      .then(url => {
        if (url) {
          i = 0
          newUrl = ''
        }
      })
      .catch(error => {
        console.log(error)
      })
  }
  return newUrl
}

module.exports = shortener
