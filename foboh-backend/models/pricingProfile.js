// Pricing Profile Schema - Defines the structure of a pricing profile
// This is used to validate the pricing profile data

const selectionType = ['all', 'multiple', 'single', 'one'];
const adjustmentTypes = ['none', 'fixed', 'dynamic', 'percentage'];
const adjustmentOperations = ['none', 'increment', 'decrement', 'increase', 'decrease'];

const PricingProfileSchema = {
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String },
  basedOn: { type: String, required: false },
  adjustmentType: { type: String, enum: adjustmentTypes, default: 'none' },
  adjustmentOperation: { type: String, enum: adjustmentOperations, default: 'none' },
  adjustmentValue: { type: Number },
  perProductAdjustments: {
    type: [
      {
        id: { type: String, required: true },
        value: { type: Number, required: true },
        type: { type: String, enum: adjustmentTypes },
        operation: { type: String, enum: adjustmentOperations },
      },
    ],
    default: [],
  },
  products: { type: [String], required: true },
  selectionType: { type: String, enum: selectionType, default: 'all' },
};
module.exports = { PricingProfileSchema }; 