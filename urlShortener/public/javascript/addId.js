const express = require('express')
const shortUrl = require("../../models/shortUrl")

function getNextSequence(name) {
  let ret = shortUrl.counters.findAndModify(
    {
      query: { _id: name },
      update: { $inc: { seq: 1 } },
      new: true
    }
  )

  return ret.seq
}