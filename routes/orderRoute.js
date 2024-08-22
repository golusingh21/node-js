const express = require('express');
const router = express.Router()
const {authMiddleware} = require('../middleware/authMiddleware');
const orderController = require('../controller/orderController');

router.post('/', authMiddleware, orderController.productPayment);

module.exports = router;