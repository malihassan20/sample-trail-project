const express = require('express')
const router = express.Router()
const businessController = require('../controllers').businessController

router.post('/getTransactionList', businessController.getTransactionList)
router.get('/getBusinessList', businessController.getBusinessList)

module.exports = router
