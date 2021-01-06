const express = require('express')
const router = express.Router()
const transactionController = require('../controllers').transactionController

/* GET transaction list */
router.get('/getTransactionList', transactionController.getTransactionList)

module.exports = router
