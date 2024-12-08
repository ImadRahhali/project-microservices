const vehicleService = require('../services/vehicleService');

exports.getAllVehicles = async (req, res, next) => {
  try {
    const vehicles = await vehicleService.getAllVehicles();
    res.json(vehicles);
  } catch (error) {
    next(error);
  }
};

exports.getVehicleById = async (req, res, next) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.addVehicle = async (req, res, next) => {
  try {
    const { ownerId, ...vehicleData } = req.body;

    // Validate owner via Customer Service
    const owner = await vehicleService.validateOwner(ownerId);
    if (!owner) {
      return res.status(400).json({ error: 'Invalid owner ID (CIN)' });
    }

    const vehicle = await vehicleService.addVehicle({ ownerId, ...vehicleData });
    res.status(201).json(vehicle);
  } catch (error) {
    next(error);
  }
};

exports.updateVehicle = async (req, res, next) => {
    try {
      const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
      res.json(vehicle);
    } catch (error) {
      // If the error is "Vehicle not found", return a 404 response
      if (error.message === 'Vehicle not found') {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      // For other errors, return a 500 Internal Server Error
      next(error);
    }
  };
  

exports.deleteVehicle = async (req, res, next) => {
  try {
    await vehicleService.deleteVehicle(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
