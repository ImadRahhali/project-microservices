const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const vehicleRoutes = require('./routes/vehicleRoutes');
const { errorHandler } = require('./utils/errorHandler');

const app = express();

app.use(cors());
// Middleware
app.use(bodyParser.json());

// Routes
app.use('/vehicles', vehicleRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Vehicle Service running on port ${PORT}`);
});
