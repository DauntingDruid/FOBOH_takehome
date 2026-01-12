const express = require('express');
const router = express.Router();
const controller = require('../controllers/pricingProfileController');

// CRUD operations for pricing profiles
 // Create operations
    router.post('/', controller.createProfile);
 // Read operations
    router.get('/', controller.getAllProfiles);
    router.get('/:id', controller.getProfileById);
 // Update operations
    router.put('/:id', controller.updateProfile);
 // Delete operations
    // router.delete('/:id', controller.deleteProfile);  

module.exports = router;
