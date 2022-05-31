const shortUrl = require("../../models/shortUrl")

function shortener() {
  const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'.split('')
  let newUrl = ''
  for (let i = 0; i < 5; i++) {
    newUrl += chars[Math.floor(Math.random() * chars.length)]
    // if (checkUrl(newUrl) === true) {
    //   i = 0
    //   newUrl = ''
    // }
  }
  return newUrl
}
function checkUrl(short) {
  const result = shortUrl.findOne(short)
  if (result) {
    return true
  }
  return false
}
//console.log(shortener())

module.exports = shortener