const customerService = require('../services/customerService');
const { validateCIN } = require('../utils/validators');

exports.getAllCustomers = async (req, res, next) => {
  try {
    const customers = await customerService.getAllCustomers();
    res.json(customers);
  } catch (error) {
    next(error);
  }
};

exports.getCustomerById = async (req, res, next) => {
    try {
      const customer = await customerService.getCustomerById(req.params.id);
      if (!customer) return res.status(404).json({ error: 'Customer not found' });
      res.json(customer);
    } catch (error) {
      next(error);
    }
  };
  

exports.addCustomer = async (req, res, next) => {
    try {
      const { id, name, email, phoneNumber, address } = req.body;
  
      if (!id || !validateCIN(id)) {
        return res.status(400).json({ error: 'Invalid CIN format' });
      }
  
      const customer = await customerService.addCustomer({ id, name, email, phoneNumber, address });
      res.status(201).json(customer);
    } catch (error) {
      next(error);
    }
  };
  

  exports.updateCustomer = async (req, res, next) => {
    try {
      const { id } = req.params; // Get the ID from the URL
      const data = req.body; // Get the fields to update from the request body
  
      if (!Object.keys(data).length) {
        return res.status(400).json({ error: 'No fields provided for update' });
      }
  
      const customer = await customerService.updateCustomer(id, data);
      res.json(customer);
    } catch (error) {
      next(error);
    }
  };
  

exports.deleteCustomer = async (req, res, next) => {
  try {
    const result = await customerService.deleteCustomer(req.params.id);
    if (!result) return res.status(404).json({ error: 'Customer not found' });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
