const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const customerRoutes = require('./routes/customerRoutes');
const { errorHandler } = require('./utils/errorHandler');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/customers', customerRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Customer Service running on port ${PORT}`);
});
