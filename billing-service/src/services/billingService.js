const axios = require('axios');
const emailSender = require('../utils/emailSender');
const Invoice = require('../models/Invoice');

const WORKSHOP_SCHEDULER_API = "http://workshop-scheduler-service:5000/schedules" || 'http://localhost:5000/schedules';;
const CUSTOMER_SERVICE_URL = "http://customer-service:3000/customers" || 'http://localhost:3000/customers';
const VEHICLE_SERVICE_URL = "http://vehicle-service:4000/vehicles" || 'http://localhost:4000/vehicles';

exports.sendInvoice = async (scheduleId) => {
    const schedule = await getScheduleById(scheduleId);
    const vehicle = await getVehicleById(schedule.vehicleId);
    const customer = await getCustomerById(vehicle.ownerId);

    if (!schedule || !customer) {
        throw new Error('Schedule or customer not found.');
    }

    const invoice = new Invoice(schedule, customer);
    const emailContent = invoice.generateEmailContent();

    await emailSender.sendEmail(customer.email, 'Your Maintenance Invoice', emailContent);

    return { customer, invoice };
};

async function getScheduleById(id) {
    try {
        const response = await axios.get(`${WORKSHOP_SCHEDULER_API}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching schedule:', error.message);
        throw new Error('Failed to fetch schedule.');
    }
}
async function getVehicleById(id) {
    try {
        const response = await axios.get(`${VEHICLE_SERVICE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching customer:', error.message);
        throw new Error('Failed to fetch customer.');
    }
}
async function getCustomerById(id) {
    try {
        const response = await axios.get(`${CUSTOMER_SERVICE_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching customer:', error.message);
        throw new Error('Failed to fetch customer.');
    }
}
