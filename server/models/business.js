const mongoose = require('mongoose')
const Schema = mongoose.Schema

const schema = new Schema({
  email: {
    type: String,
    required: [true, 'Email is required']
  },
  name: {
    type: String,
    required: [true, 'Name is required']
  }
})

module.exports = mongoose.model('Business', schema, 'businesses')
