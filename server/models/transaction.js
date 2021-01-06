const mongoose = require('mongoose')
const Schema = mongoose.Schema

const constants = require('../config').constants

const schema = new Schema({
  businessId: {
    type: Schema.ObjectId,
    ref: 'business'
  },
  amount: {
    type: Schema.Decimal128,
    required: [true, 'Amount is required']
  },
  type: {
    type: String,
    enum: constants.TRANSACTION_TYPES,
    required: [true, 'Transaction type is required']
  },
  timestamp: Date.now().toISOString()
})

module.exports = mongoose.model('Transaction', schema)
