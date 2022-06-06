const shortUrl = require("../../models/shortUrl")

function shortener() {
  const chars = '0123456789abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ'
  let newUrl = ''

  for (let i = 0; i < 5; i++) {
    newUrl += chars.charAt(Math.floor(Math.random() * chars.length))
    if (i === 4) {
      if (check(newUrl) === true) {
        i = 0
        newUrl = ''
      }
      return newUrl
    }
  }  
}

async function check(newUrl) {
  await shortUrl.findOne({ short: newUrl })
    .lean()
    .then(url => {
      if (url) {
        return true
      }
      return false
    })
    .catch(error => {
      console.log(error)
    })
}

module.exports = shortener
