const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const fileupload = require('express-fileupload')
const mongoSanitize = require('express-mongo-sanitize')

const dbConnection = require('./utils/db')

const indexRouter = require('./routes/index')

const app = express()

var partialObj = {
  ingredients: [
    '12 large guajillo chiles',
    '1/4 cup corn masa harina',
    '1/4 cup unsalted peanuts',
    '1/4 cup raisins',
    '1 whole clove',
  ],
  instructions: [
    'Gather the ingredients.',
    'Make the Mole Base',
    'Mix and Cook the Mole',
  ],
}

var Recipes = [
  {
    name: 'Mole',
    ...partialObj,
  },
]

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// global var
app.set('Recipes', Recipes)
app.set('partialObj', partialObj)
app.locals.globRecipesVar = Recipes

dbConnection()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'))
app.use(cors())
app.use(helmet())
app.use(fileupload())
app.use(require('sanitize').middleware)
app.use(mongoSanitize())

app.use('/', indexRouter)

app.use(function (req, res, next) {
  next(createError(404))
})

// eslint-disable-next-line no-unused-vars
app.use(function (err, req, res, next) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
