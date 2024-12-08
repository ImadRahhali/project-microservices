const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const customerService = require('./customerService');

exports.getAllVehicles = async () => {
  return await prisma.vehicle.findMany();
};

exports.getVehicleById = async (id) => {
  return await prisma.vehicle.findUnique({ where: { id } });
};

exports.addVehicle = async (data) => {
  return await prisma.vehicle.create({
    data: {
      id: data.id,  // 'id' is the VIN (chassis number)
      registrationNumber: data.registrationNumber,
      brand: data.brand,
      model: data.model,
      year: data.year,
      color: data.color,
      mileage: data.mileage,
      fuelType: data.fuelType,
      purchaseDate: data.purchaseDate,
      ownerId: data.ownerId,  // Owner's CIN (ID)
      status: "available" // Default status (can be changed later)
    },
  });
};

exports.updateVehicle = async (id, data) => {
    // Check if the vehicle exists first
    const vehicle = await prisma.vehicle.findUnique({
      where: { id },
    });
  
    if (!vehicle) {
      // Return a specific error message if vehicle is not found
      throw new Error('Vehicle not found');
    }
  
    // If the vehicle exists, proceed with the update
    return await prisma.vehicle.update({
      where: { id },
      data,
    });
  };
  

exports.deleteVehicle = async (id) => {
  return await prisma.vehicle.delete({ where: { id } });
};

exports.validateOwner = async (ownerId) => {
  return await customerService.getCustomerById(ownerId);
};
