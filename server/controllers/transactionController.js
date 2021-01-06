const Models = require('../models')
const async = require('async')

exports.getTransactionList = function (req, res) {
  const query = req.query

  const filter = {}

  if (query.type) {
    filter.type = query.type
  }

  if (query.date) {
    filter.date = query.date
  }

  async.waterfall(
    [
      function (callback) {
        Models.transaction.count(filter, function (error, count) {
          if (error) {
            return callback(error)
          }
          return callback(null, count)
        })
      },
      function (count, callback) {
        const options = {
          lean: true
        }

        if (query.skip) {
          options.skip = parseInt(query.skip)
        }

        if (query.limit) {
          options.limit = parseInt(query.limit)
        }

        Models.transaction
          .find(filter, {}, options)
          .populate('businessId')
          .exec(function (err, data) {
            if (err) callback(err)
            else {
              callback(null, { count: count, data: data })
            }
          })
      }
    ],
    function (err, result) {
      if (err) return res.send(err)
      else {
        return res.send(result)
      }
    }
  )
}
