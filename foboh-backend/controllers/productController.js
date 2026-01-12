// Product Controller - Handles logic for product endpoints
const productsData = require('../data/products');

exports.getAllProducts = (req, res) => {
  res.status(200).json(productsData.products);
};

exports.getProductById = (req, res) => {
  res.status(200).json(productsData.products.find(product => product.id === req.params.id));
};

// For now I have just implemented a basic search functionality, but as a future improvement we can implement a more advanced search functionality using algorithms like fuzzy search, levenshtein distance, etc.
exports.searchProducts = (req, res) => {
  console.log("SEARCHING PRODUCTS WITH QUERY PARAMS: ", req.query);
  const { search, sku, subCategory, segment, brand } = req.query;
  let filteredProducts = productsData.products;
  if (search) {
    filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(search.toLowerCase()));
  }
  if (sku) {
    filteredProducts = filteredProducts.filter(product => product.sku.toLowerCase().includes(sku.toLowerCase()));
  }
  if (subCategory) {
    filteredProducts = filteredProducts.filter(product => product.subCategory.toLowerCase().includes(subCategory.toLowerCase()));
  }
  if (segment) {
    filteredProducts = filteredProducts.filter(product => product.segment.toLowerCase().includes(segment.toLowerCase()));
  }
  if (brand) {
    filteredProducts = filteredProducts.filter(product => product.brand.toLowerCase().includes(brand.toLowerCase()));
  }
  console.log("filteredProducts : ", filteredProducts);
  
  if (!Array.isArray(filteredProducts)) filteredProducts = [];
  res.status(200).json(filteredProducts);
};