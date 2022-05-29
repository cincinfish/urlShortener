const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shortUrlSchema = new Schema({
  full: {
    type: String,
    required: true
  },
  short: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)