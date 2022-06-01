const shortUrl = require("../../models/shortUrl")

function shortener() {
  const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('')
  let newUrl = ''
  for (let i = 0; i < 5; i++) {
    newUrl += chars[Math.floor(Math.random() * chars.length)]
  }
  return newUrl
}
module.exports = shortener
