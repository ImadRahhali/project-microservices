const { PrismaClient } = require("@prisma/client");
const { getVehicleById } = require("../services/vehicleService");
const { getCustomerById } = require("../services/customerService");
const kafka = require('kafka-node'); // Kafka dependency

const prisma = new PrismaClient();

// Kafka client and producer setup
const client = new kafka.KafkaClient({  
    kafkaHost: 'kafka:9092',
    requestTimeout: 60000
});
const producer = new kafka.Producer(client);

// Function to publish events to Kafka
const publishNotificationEvent = (message) => {
    const payloads = [
        {
            topic: 'schedule-events',  // Kafka topic name
            messages: JSON.stringify(message),  // Event data
            partition: 0,
        },
    ];

    producer.send(payloads, (err, data) => {
        if (err) {
            console.error('Error publishing Kafka event:', err);
        } else {
            console.log('Kafka event published:', data);
        }
    });
};

// Get all schedules
const getAllSchedules = async (req, res) => {
    try {
        const schedules = await prisma.schedule.findMany();
        res.status(200).json(schedules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single schedule by ID
const getScheduleById = async (req, res) => {
    const { id } = req.params;

    try {
        const schedule = await prisma.schedule.findUnique({
            where: { id: parseInt(id) },
        });
        if (!schedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }
        res.status(200).json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Create a new schedule
const createSchedule = async (req, res) => {
    const { startTime, endTime, description, status, vehicleId } = req.body;

    try {
        // Validate vehicle existence and fetch owner
        const vehicle = await getVehicleById(vehicleId);
        if (!vehicle) {
            return res.status(404).json({ error: "Vehicle not found" });
        }

        // Fetch customer details
        const customer = await getCustomerById(vehicle.ownerId);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }

        // Create the schedule
        const schedule = await prisma.schedule.create({
            data: { startTime, endTime, description, status, vehicleId },
        });

        // Prepare the Kafka message to send (e.g., for notifications)
        const notificationMessage = {
            type: 'schedule-created',  // Event type
            customerId: vehicle.ownerId,
            vehicleId,
            startTime,
            endTime,
            description,
        };

        // Publish the event to Kafka
        publishNotificationEvent(notificationMessage);

        res.status(201).json(schedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update an existing schedule
const updateSchedule = async (req, res) => {
    const { id } = req.params;
    const { startTime, endTime, description, status } = req.body;

    try {
        const existingSchedule = await prisma.schedule.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingSchedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        const updatedSchedule = await prisma.schedule.update({
            where: { id: parseInt(id) },
            data: { startTime, endTime, description, status },
        });

        // Prepare the Kafka message to send (e.g., for notifications)
        const notificationMessage = {
            type: 'schedule-updated',  // Event type for updates
            customerId: existingSchedule.vehicleId,
            vehicleId: existingSchedule.vehicleId,
            startTime,
            endTime,
            description,
        };

        // Publish the event to Kafka
        publishNotificationEvent(notificationMessage);

        res.status(200).json(updatedSchedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete a schedule
const deleteSchedule = async (req, res) => {
    const { id } = req.params;

    try {
        const existingSchedule = await prisma.schedule.findUnique({
            where: { id: parseInt(id) },
        });
        if (!existingSchedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        await prisma.schedule.delete({
            where: { id: parseInt(id) },
        });

        // Prepare the Kafka message to send (e.g., for notifications)
        const notificationMessage = {
            type: 'schedule-deleted',  // Event type for deletion
            customerId: existingSchedule.vehicleId,
            vehicleId: existingSchedule.vehicleId,
            id, // Include the deleted schedule ID
        };

        // Publish the event to Kafka
        publishNotificationEvent(notificationMessage);

        res.status(204).send(); // No Content
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PATCH request to mark schedule as notified
const markAsNotified = async (req, res) => {
    const { id } = req.params;

    try {
        const schedule = await prisma.schedule.findUnique({
            where: { id: parseInt(id) },
        });

        if (!schedule) {
            return res.status(404).json({ error: "Schedule not found" });
        }

        const updatedSchedule = await prisma.schedule.update({
            where: { id: parseInt(id) },
            data: { status: "notified" },
        });

        const notificationMessage = {
            type: 'schedule-notified',  
            scheduleId: updatedSchedule.id,
            status: updatedSchedule.status,
            customerId: updatedSchedule.vehicleId,
        };

        publishNotificationEvent(notificationMessage);

        res.status(200).json(updatedSchedule);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    markAsNotified,  // Export the new function
};
