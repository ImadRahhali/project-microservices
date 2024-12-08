const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.getAllCustomers = async () => {
  return await prisma.customer.findMany();
};

exports.getCustomerById = async (id) => {
    return await prisma.customer.findUnique({ where: { id } });
  };
  

exports.addCustomer = async (data) => {
    // Check if customer with the given CIN already exists
    const existingCustomer = await prisma.customer.findUnique({ where: { id: data.id } });
    if (existingCustomer) {
      throw new Error('Customer with this CIN already exists');
    }
  
    // Create the customer
    return await prisma.customer.create({ data });
  };
  

  exports.updateCustomer = async (id, data) => {
    if (!id) {
      throw new Error('Customer ID (CIN) is required');
    }
  
    return await prisma.customer.update({
      where: { id: String(id) }, // Ensure `id` is treated as a string
      data, // Prisma will only update the fields present in `data`
    });
  };
  

exports.deleteCustomer = async (id) => {
  return await prisma.customer.delete({ where: { id: parseInt(id) } });
};
