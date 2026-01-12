const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
// GET products by Query Params (search, sku, category, segment, brand)
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);

module.exports = router;
