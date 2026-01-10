const express = require('express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

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
  apis: ['./index.js'],
};

const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
  console.log('Hey you can check the Swagger docs at http://localhost:3000/api-docs');
});