
const express = require('express');
const router = express.Router();
const controller = require('../controllers/priceController');

module.exports = router;

router.post('/', controller.calculatePrices);
