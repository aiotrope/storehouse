const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const fileupload = require('express-fileupload')
const mongoSanitize = require('express-mongo-sanitize')
const session = require('express-session')

const dbConnection = require('./utils/db')

const indexRouter = require('./routes/index')

const app = express()

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

dbConnection()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static(path.join(__dirname, 'uploads')))
app.use(cors())
app.use(fileupload())
app.use(require('sanitize').middleware)
app.use(mongoSanitize())
app.use(
  session({
    secret: 'nail stubbly numbness',
    resave: false,
    saveUninitialized: true,
  })
)

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
