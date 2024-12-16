const axios = require('axios');

const CUSTOMER_SERVICE_URL = "http://customer-service:3000/customers" || 'http://localhost:3000/customers';

exports.getCustomerById = async (id) => {
  try {
    const response = await axios.get(`${CUSTOMER_SERVICE_URL}/${id}`);
    return response.data;
  } catch (error) {
    return null; // Return null if the customer is not found
  }
};
