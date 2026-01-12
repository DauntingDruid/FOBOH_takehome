const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         id: { type: string }
 *         title: { type: string }
 *         sku: { type: string }
 *         brand: { type: string }
 *         category: { type: string }
 *         subCategory: { type: string }
 *         segment: { type: string }
 *         price: { type: number }
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Product' }
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products by query params
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: sku
 *         schema: { type: string }
 *       - in: query
 *         name: subCategory
 *         schema: { type: string }
 *       - in: query
 *         name: segment
 *         schema: { type: string }
 *       - in: query
 *         name: brand
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Filtered products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Product' }
 */
router.get('/search', productController.searchProducts);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get product by id
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: Product
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Product' }
 *       404:
 *         description: Not found
 */
router.get('/:id', productController.getProductById);

module.exports = router;
