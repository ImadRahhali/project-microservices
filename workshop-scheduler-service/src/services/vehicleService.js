const axios = require("axios");

const VEHICLE_SERVICE_URL = "http://vehicle-service:4000/vehicles" || 'http://localhost:4000/vehicles';

exports.getVehicleById = async (vehicleId) => {
    try {
        const response = await axios.get(`${VEHICLE_SERVICE_URL}/${vehicleId}`);
        return response.data
    } catch (error) {
        return null
    }
};
