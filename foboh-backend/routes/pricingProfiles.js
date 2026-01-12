const express = require('express');
const router = express.Router();
const controller = require('../controllers/pricingProfileController');

/**
 * @swagger
 * components:
 *   schemas:
 *     PerProductAdjustment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         value:
 *           type: number
 *         type:
 *           type: string
 *           enum: [none, fixed, dynamic, percentage]
 *         operation:
 *           type: string
 *           enum: [none, increment, decrement, increase, decrease]
 *     PricingProfile:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *         basedOn:
 *           type: string
 *           nullable: true
 *         adjustmentType:
 *           type: string
 *           enum: [none, fixed, dynamic, percentage]
 *         adjustmentOperation:
 *           type: string
 *           enum: [none, increment, decrement, increase, decrease]
 *         adjustmentValue:
 *           type: number
 *         products:
 *           type: array
 *           items:
 *             type: string
 *         selectionType:
 *           type: string
 *           enum: [all, multiple, single, one]
 *         perProductAdjustments:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PerProductAdjustment'
 */

/**
 * @swagger
 * /pricing-profiles:
 *   get:
 *     summary: Get all pricing profiles
 *     tags: [PricingProfiles]
 *     responses:
 *       200:
 *         description: List of pricing profiles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PricingProfile'
 */
router.get('/', controller.getAllProfiles);

/**
 * @swagger
 * /pricing-profiles/{id}:
 *   get:
 *     summary: Get a pricing profile by id
 *     tags: [PricingProfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Pricing profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PricingProfile'
 *       404:
 *         description: Not found
 */
router.get('/:id', controller.getProfileById);

/**
 * @swagger
 * /pricing-profiles:
 *   post:
 *     summary: Create a pricing profile
 *     tags: [PricingProfiles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PricingProfile'
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.post('/', controller.createProfile);

/**
 * @swagger
 * /pricing-profiles/{id}:
 *   put:
 *     summary: Update a pricing profile
 *     tags: [PricingProfiles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PricingProfile'
 *     responses:
 *       200:
 *         description: Updated
 *       404:
 *         description: Not found
 */
router.put('/:id', controller.updateProfile);

module.exports = router;
