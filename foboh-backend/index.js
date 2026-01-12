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