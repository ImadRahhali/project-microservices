const axios = require('axios');

const CUSTOMER_SERVICE_URL = process.env.CUSTOMER_SERVICE_URL || 'http://localhost:3000/customers';

exports.getCustomerById = async (id) => {
  try {
    const response = await axios.get(`${CUSTOMER_SERVICE_URL}/${id}`);
    return response.data;
  } catch (error) {
    return null; // Return null if the customer is not found
  }
};
