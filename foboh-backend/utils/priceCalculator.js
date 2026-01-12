// Utils/priceCalculator.js - Helper to adjust prices (fixed or dynamic, increase or decrease)

function calculateNewPrice(basePrice, adjType, op, value) {
  let newPrice = basePrice;
  if (adjType === 'fixed') {
    newPrice = op === '+' ? basePrice + value : basePrice - value;
  } else if (adjType === 'dynamic') {
    const delta = basePrice * (value / 100);
    newPrice = op === '+' ? basePrice + delta : basePrice - delta;
  }
  // This prevents the price from being negative
  return Math.max(0, newPrice); 
}

module.exports = { calculateNewPrice };
