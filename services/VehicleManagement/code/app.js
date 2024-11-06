const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000; // Use PORT from .env file

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// MySQL database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,         // Use DB_HOST from .env file
  user: process.env.DB_USER,         // Use DB_USER from .env file
  password: process.env.DB_PASSWORD, // Use DB_PASSWORD from .env file
  database: process.env.DB_NAME      // Use DB_NAME from .env file
});

// Connect to MySQL database
db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Customer Management API URL (from .env file)
const customerApiUrl = process.env.CUSTOMER_API_URL;

// Function to check if the owner exists in the Customer Management API
const checkOwnerExists = async (owner_id) => {
  try {
    const response = await axios.get(`${customerApiUrl}/customer/${owner_id}`);
    if (response.status === 200) {
      return true; // Owner exists
    }
  } catch (error) {
    return false; // Owner does not exist or error occurred
  }
  return false;
};

// API endpoint to create a new vehicle
app.post('/vehicles', async (req, res) => {
  const { vin, registration_number, brand, model, year, color, mileage, fuel_type, purchase_date, owner_id, status } = req.body;

  // Check if the owner exists
  const ownerExists = await checkOwnerExists(owner_id);
  if (!ownerExists) {
    return res.status(400).json({ message: 'Owner does not exist in the Customer Management Service' });
  }

  const query = 'INSERT INTO vehicles (vin, registration_number, brand, model, year, color, mileage, fuel_type, purchase_date, owner_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  const values = [vin, registration_number, brand, model, year, color, mileage, fuel_type, purchase_date, owner_id, status];

  db.execute(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ message: 'Vehicle added successfully', vehicle_id: result.insertId });
  });
});

// API endpoint to get a list of vehicles
app.get('/vehicles', (req, res) => {
  const query = 'SELECT * FROM vehicles';

  db.execute(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.status(200).json(results);
  });
});

// API endpoint to get a vehicle by ID
app.get('/vehicles/:id', (req, res) => {
  const vehicleId = req.params.id;

  const query = 'SELECT * FROM vehicles WHERE id = ?';
  db.execute(query, [vehicleId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json(result[0]);
  });
});

// API endpoint to update vehicle information
app.put('/vehicles/:id', async (req, res) => {
  const vehicleId = req.params.id;
  const { vin, registration_number, brand, model, year, color, mileage, fuel_type, purchase_date, owner_id, status } = req.body;

  // Check if the owner exists
  const ownerExists = await checkOwnerExists(owner_id);
  if (!ownerExists) {
    return res.status(400).json({ message: 'Owner does not exist in the Customer Management Service' });
  }

  const query = 'UPDATE vehicles SET vin = ?, registration_number = ?, brand = ?, model = ?, year = ?, color = ?, mileage = ?, fuel_type = ?, purchase_date = ?, owner_id = ?, status = ? WHERE id = ?';
  const values = [vin, registration_number, brand, model, year, color, mileage, fuel_type, purchase_date, owner_id, status, vehicleId];

  db.execute(query, values, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle updated successfully' });
  });
});

// API endpoint to delete a vehicle
app.delete('/vehicles/:id', async (req, res) => {
  const vehicleId = req.params.id;

  // Get the owner_id from the vehicle before deleting
  const query = 'SELECT owner_id FROM vehicles WHERE id = ?';
  db.execute(query, [vehicleId], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const ownerId = result[0].owner_id;

    // Check if the owner exists before deleting
    const ownerExists = await checkOwnerExists(ownerId);
    if (!ownerExists) {
      return res.status(400).json({ message: 'Owner does not exist in the Customer Management Service' });
    }

    // Proceed with deletion
    const deleteQuery = 'DELETE FROM vehicles WHERE id = ?';
    db.execute(deleteQuery, [vehicleId], (err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      res.status(200).json({ message: 'Vehicle deleted successfully' });
    });
  });
});

// Start the Express server
app.listen(port, () => {
  console.log(`Vehicle management service running on http://localhost:${port}`);
});
