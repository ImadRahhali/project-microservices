const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const billingRoutes = require('./routes/billingRoutes.js');
const ScheduleChecker = require('./services/scheduleChecker');
const { errorHandler } = require('./utils/errorHandler');

const app = express();

// Enable CORS for all origins
app.use(cors());

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/billing', billingRoutes);

// Error handling middleware
app.use(errorHandler);

ScheduleChecker.start();

const PORT = process.env.PORT || 6000;
app.listen(PORT, () => {
  console.log(`Billing Service running on port ${PORT}`);
});
