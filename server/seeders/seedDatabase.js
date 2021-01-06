const seedr = require('mongoose-seedr')
const path = require('path')

const dbConfig = require('../config').dbConfig

seedr.seed({
  databaseURL: dbConfig.config.dbURI,
  seed: [
    {
      documents: path.join(__dirname, 'businesses.js'),
      collection: 'businesses'
    },
    {
      documents: path.join(__dirname, 'transactions.js'),
      collection: 'transactions'
    }
  ]
})
