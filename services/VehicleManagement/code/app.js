const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// MySQL connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,    // Wait for a connection if all are busy
  connectionLimit: 10,          // Maximum number of connections in the pool
  queueLimit: 0                 // Unlimited number of queued connection requests
}).promise();                   // Enable promise-based syntax

// Customer Management API URL
const customerApiUrl = process.env.CUSTOMER_API_URL;

// Function to check if the owner exists in the Customer Management API
const checkOwnerExists = async (owner_id) => {
  try {
    const response = await axios.get(`${customerApiUrl}/customer/${owner_id}`);
    return response.status === 200;
  } catch (error) {
    return false; // Owner does not exist or error occurred
  }
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

  try {
    const [result] = await pool.execute(query, values);
    res.status(201).json({ message: 'Vehicle added successfully', vehicle_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to get a list of vehicles
app.get('/vehicles', async (req, res) => {
  const query = 'SELECT * FROM vehicles';

  try {
    const [results] = await pool.execute(query);
    res.status(200).json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to get a vehicle by ID
app.get('/vehicles/:id', async (req, res) => {
  const vehicleId = req.params.id;
  const query = 'SELECT * FROM vehicles WHERE id = ?';

  try {
    const [result] = await pool.execute(query, [vehicleId]);
    if (result.length === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
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

  try {
    const [result] = await pool.execute(query, values);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle updated successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API endpoint to delete a vehicle
app.delete('/vehicles/:id', async (req, res) => {
  const vehicleId = req.params.id;

  // Get the owner_id from the vehicle before deleting
  const query = 'SELECT owner_id FROM vehicles WHERE id = ?';
  try {
    const [result] = await pool.execute(query, [vehicleId]);
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
    await pool.execute(deleteQuery, [vehicleId]);
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Vehicle management service running on http://localhost:${port}`);
});
