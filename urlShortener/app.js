const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const routes = require('./routes')

require('./config/mongoose')

app.engine('hbs', exphbs.engine({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

// setting static files
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(routes)


app.listen(port, () => {
  console.log(`Express is listening on localhost:${port}`)
})