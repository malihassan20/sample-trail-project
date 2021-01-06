const mongoose = require('mongoose')
const Schema = mongoose.Schema

const constants = require('../config').constants

const schema = new Schema({
  businessId: {
    type: Schema.Types.ObjectId,
    ref: 'Business'
  },
  amount: {
    type: Schema.Types.Decimal128,
    required: [true, 'Amount is required']
  },
  type: {
    type: String,
    enum: constants.TRANSACTION_TYPES,
    required: [true, 'Transaction type is required']
  },
  timestamp: { type: String, default: new Date().toISOString() }
})

module.exports = mongoose.model('Transaction', schema, 'transactions')
