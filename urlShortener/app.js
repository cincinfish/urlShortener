const express = require('express')
const app = express()
const port = 3000

const methodOverride = require('method-override')
const routes = require('./routes')

app.use(routes)


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})