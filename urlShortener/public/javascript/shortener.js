const shortUrl = require("../../models/shortUrl")

function shortener() {
  const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('')
  let newUrl = ''
  for (let i = 0; i < 5; i++) {
    newUrl += chars[Math.floor(Math.random() * chars.length)]
    if (checkUrl(newUrl) === true) {
      i = 0
      newUrl = ''
    }
  }
  return newUrl
}
async function checkUrl(short) {
  await shortUrl.findOne({ short })
    .lean()
    .then(url => {
      console.log("shorturl", url)
      if (url) {
        console.log("short", url.short)
        return true
      }
      return false
    })
    .catch(error => {
      console.log(error)
    })
}


module.exports = shortener
