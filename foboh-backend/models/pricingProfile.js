// Pricing Profile Schema - Defines the structure of a pricing profile
// This is used to validate the pricing profile data

const types = {
  selectionType: {
    type: String,
    enum: ['all', 'multiple', 'single'],
    required: true,
  },
}

const PricingProfileSchema = {
  id: { type: String, required: true },
  name: { type: String, required: true },
  basedOn: { type: String, required: true },
  adjustmentType: { type: String, required: true },
  adjustmentOp: { type: String, required: true },
  adjustmentValue: { type: Number, required: true },
  productIds: { type: [String], required: true },
  selectionType: { type: String, enum: types.selectionType, default: 'all' },
};
module.exports = { PricingProfileSchema }; 