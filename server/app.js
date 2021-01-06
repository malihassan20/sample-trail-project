const createError = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const dbConfig = require('./config').dbConfig

const app = express()
app.use(cors())

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// Initialize the api routes
require('./routes')(app)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// do the db connection
mongoose.connect(dbConfig.config.dbURI, {
  useUnifiedTopology: true,
  useNewUrlParser: true
})
mongoose.connection.once('open', function () {
  console.log('Connected to the Database.')
})
mongoose.connection.on('error', function (error) {
  console.log('Mongoose Connection Error : ' + error)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
