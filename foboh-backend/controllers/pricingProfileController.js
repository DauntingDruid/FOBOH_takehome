// Pricing Profile Controller - Handles logic for pricing profile endpoints
const pricingProfilesData = require('../data/pricingProfiles');
const productsData = require('../data/products');
const priceCalculator = require('../utils/priceCalculator');

// This function returns all pricing profiles
exports.getAllProfiles = (req, res) => {
  res.status(200).json(pricingProfilesData.pricingProfiles);
};

// This function returns the pricing profile details and the products in the pricing profile with the adjusted prices
exports.getProfileById = (req, res) => {
  //First I fetch the pricing profile from the data
  const profile = pricingProfilesData.pricingProfiles.find(profile => profile.id === req.params.id);

  // Then I fetch the products from the data  
  const products = productsData.products.filter(product => profile.products.includes(product.id));

  // Then I apply the adjustment to the products using the UTILS function, which is in the utils folder called priceCalculator.js
  const perProductAdjustments = profile.perProductAdjustments || [];

  const adjustedProducts = products.map(product => {
    const override = perProductAdjustments.find(adj => `${adj.id}` === `${product.id}`);
    const adjType = override?.type || profile.adjustmentType || 'fixed';
    const adjOp = override?.operation || profile.adjustmentOperation || 'none';
    const adjVal = override?.value ?? profile.adjustmentValue ?? 0;

    return {
      ...product,
      price: product.price,
      newPrice: priceCalculator.calculateNewPrice(product.price, adjType, adjOp, adjVal),
      adjustmentValue: adjVal,
    };
  });

  res.status(200).json({
    id: profile.id,
    name: profile.name,
    description: profile.description,
    status: profile.status,
    products: adjustedProducts,
    adjustmentMode: profile.adjustmentType,
    adjustmentIncrementMode: profile.adjustmentOperation,
    basedOnProfileId: profile.basedOn || null,
    selectionType: profile.selectionType || 'one',
    perProductAdjustments,
  });
};

exports.createProfile = (req, res) => {
  const {
    name,
    description = '',
    basedOn = null,
    adjustmentType = 'none',
    adjustmentOperation = 'none',
    products = [],
    selectionType = 'all',
    perProductAdjustments = [],
  } = req.body || {};

  if (!name) {
    return res.status(400).json({ message: 'Name is required' });
  }

  const newProfile = {
    id: `${Date.now()}`,
    name,
    description,
    status: 'Draft',
    basedOn,
    adjustmentType,
    adjustmentOperation,
    perProductAdjustments,
    products,
    selectionType,
  };

  pricingProfilesData.pricingProfiles.push(newProfile);

  res.status(201).json(newProfile);
};

exports.updateProfile = (req, res) => {
  const profileId = req.params.id;
  const updatedData = req.body;

  // Find the profile by ID
  const profileIndex = pricingProfilesData.pricingProfiles.findIndex(profile => profile.id === profileId);
  if (profileIndex === -1) {
    return res.status(404).json({ message: 'Profile not found' });
  }

  // Update the profile in memory
  pricingProfilesData.pricingProfiles[profileIndex] = {
    ...pricingProfilesData.pricingProfiles[profileIndex],
    ...updatedData
  };

  res.status(200).json(pricingProfilesData.pricingProfiles[profileIndex]);
};
