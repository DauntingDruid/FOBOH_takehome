const express = require('express');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const pricingProfilesRoutes = require('./routes/pricingProfiles');
const productsRoutes = require('./routes/products');
const priceRoutes = require('./routes/pricing');
const app = express();

app.use(cors({ origin: ['http://localhost:3001', 'https://foboh-takehome.vercel.app'] }));
app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[${req.method}] ${req.originalUrl}`);
  next();
});


// Routes
 app.use('/pricing-profiles', pricingProfilesRoutes);
 app.use('/products', productsRoutes);
 app.use('/price-calculation', priceRoutes);

 // Business Logic: 
  // Price Calculation - POST /price-calculation
    // if pricingProfileId is not provided, use the default pricing profile
    // if pricingProfileId is provided but the product is not in the pricing profile, use the global wholesale price
    // if pricingProfileId is provided and the product is in the pricing profile, use the pricing profile price
    // payload: {
    //   productItemIds: [
    //     '1',
    //     '2',
    //     '3',
    //   ],
    //   pricingProfileId: '1', // optional, but if provided check if the product is in the profile then use that price, if not use the global wholesale price
    // }
    // response: {
    //   productItemsPriceAdjusted: [
    //     {
    //       productId: '1',
    //       new_price: 110.00,
    //     },
    //     {
    //       productId: '2',
    //       new_price: 120.00,
    //     },
    //     {
    //       productId: '3',
    //       new_price: 130.00,
    //     },
    //   ],
    // }

// Swagger
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'FOBOH Pricing API',
    version: '1.0',
  },
};
const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};
const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Hey you can check the Swagger docs at http://localhost:3000/api-docs');
});