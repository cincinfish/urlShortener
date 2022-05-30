const mongoose = require('mongoose')
const Schema = mongoose.Schema

const shortUrlSchema = new Schema({
  full: {
    type: String,
    required: true
  },
  short: {
    type: Boolean,
    required: false
  },
  id: {
    type: Number,
    required: false
  }
})

module.exports = mongoose.model('ShortUrl', shortUrlSchema)