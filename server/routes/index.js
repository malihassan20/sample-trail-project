const transactionRoutes = require('./transactionRoutes')

module.exports = function (app) {
  app.get('/api', function (req, res, next) {
    res.status(200).json({
      message: 'Call the api using the required routes'
    })
  })

  // We will prefix the all our routes with /api
  app.use('/api', transactionRoutes)
}
