const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const scheduleRoutes = require('./routes/scheduleRoutes');
const { errorHandler } = require('./utils/errorHandler');

const app = express();

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/schedules', scheduleRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Workshop Scheduler running on port ${PORT}`);
});
