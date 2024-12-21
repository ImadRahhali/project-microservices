const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 5000;

// Configuration des services backend
const CUSTOMER_SERVICE_URL = "http://localhost:3000";
const VEHICLE_SERVICE_URL = "http://localhost:4000";
const SCHEDULE_SERVICE_URL = "http://localhost:5000";

// Rediriger les requêtes vers le service clients
app.use("/customers", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${CUSTOMER_SERVICE_URL}${req.url}`,
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Error connecting to customer service");
  }
});

// Rediriger les requêtes vers le service véhicules
app.use("/vehicles", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${VEHICLE_SERVICE_URL}${req.url}`,
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Error connecting to vehicle service");
  }
});

// Rediriger les requêtes vers le service planning des maintenances
app.use("/schedules", async (req, res) => {
  try {
    const response = await axios({
      method: req.method,
      url: `${SCHEDULE_SERVICE_URL}${req.url}`,
      data: req.body,
      headers: req.headers,
    });
    res.status(response.status).send(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .send(error.response?.data || "Error connecting to schedule service");
  }
});

// Démarrer l'API Gateway
app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
