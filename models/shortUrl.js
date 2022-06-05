const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shortUrlSchema = new Schema({
  full: {
    type: String,
    required: true,
    unique: true
  },
  short: {
    type: String,
    required: true,
    unique: true
  }
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)