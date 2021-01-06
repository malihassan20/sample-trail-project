const Models = require('../models')
const async = require('async')

exports.getTransactionList = function (req, res) {
  const query = req.query

  const filter = {}

  if (query.type) {
    filter.type = query.type
  }

  if (query.startDate && query.endDate) {
    filter.timestamp = {
      $gte: query.startDate,
      $lte: query.endDate
    }
  } else if (query.startDate) {
    filter.timestamp = {
      $gte: query.startDate
    }
  } else if (query.endDate) {
    filter.timestamp = {
      $lte: query.endDate
    }
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
        } else {
          options.skip = 0
        }

        if (query.limit) {
          options.limit = parseInt(query.limit)
        } else {
          options.limit = 30
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
      if (err) return res.status(200).send({ error: err })
      else {
        return res.status(200).send(result)
      }
    }
  )
}
