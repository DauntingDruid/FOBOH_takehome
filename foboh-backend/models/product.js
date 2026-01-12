// Product Schema - Defines the structure of a product
// This is used to validate the product data

const ProductSchema = {
  id: { type: String, required: true },
  title: { type: String, required: true },
  sku: { type: String, required: true },
  brand: { type: String, required: true },
  category: { type: String, required: true },
  subCategory: { type: String, required: true },
  segment: { type: String, required: true },
  price: { type: Number, required: true },
};
module.exports = { ProductSchema }; 