const { products } = require('../data/products');
const { calculateNewPrice } = require('../utils/priceCalculator');
const { pricingProfiles } = require('../data/pricingProfiles');

// Map increment mode to calculator op
const opMap = {
  increment: '+',
  decrement: '-',
};

exports.calculatePrices = (req, res) => {
  try {
    const {
      productItems = [],
      pricingProfileId,
    } = req.body || {};

    if (!Array.isArray(productItems) || productItems.length === 0) {
      return res.status(400).json({ message: 'productItems is required and must be a non-empty array' });
    }

    const profile = pricingProfileId
      ? pricingProfiles.find((p) => p.id === `${pricingProfileId}`)
      : pricingProfiles.find((p) => p.id === '1'); // default global wholesale

    const results = productItems.map((item) => {
      const product = products.find((p) => `${p.id}` === `${item.productId}`);
      if (!product) {
        return { productId: item.productId, error: 'Product not found' };
      }

  const perProductAdj = profile?.perProductAdjustments?.find((adj) => `${adj.id}` === `${product.id}`);

  // derive adjustment inputs per item, fallback to per-product override, then profile defaults
  const adjType = item.adjustmentMode || perProductAdj?.type || profile?.adjustmentType || 'fixed';
  const adjValue = Number(item.adjustmentValue ?? perProductAdj?.value ?? profile?.adjustmentValue ?? 0);
  const profileOp = profile?.adjustmentOperation === 'decrease' ? 'decrement' : profile?.adjustmentOperation;
  const adjOpKey = item.adjustmentIncrementMode || perProductAdj?.operation || profileOp || 'increment';
  const adjOp = opMap[adjOpKey] || '+';

  const newPrice = calculateNewPrice(product.price, adjType === 'percentage' ? 'dynamic' : adjType, adjOp, adjValue);

      return {
        productId: product.id,
        basePrice: product.price,
        newPrice,
      };
    });

    res.status(200).json({ productItemsPriceAdjusted: results });
  } catch (err) {
    console.error('Error calculating prices', err);
    res.status(500).json({ message: 'Failed to calculate prices' });
  }
};
