const kafka = require('kafka-node');
const axios = require('axios');
const { sendEmail } = require('./sendEmail'); // Import the sendEmail function

// Kafka consumer setup
const client = new kafka.KafkaClient({  
    kafkaHost: 'kafka:9092'});
    
const consumer = new kafka.Consumer(
    client,
    [{ topic: 'schedule-events', partition: 0 }],
    { autoCommit: false }
);

// Handle incoming Kafka messages
consumer.on('message', async (message) => {
    const event = JSON.parse(message.value);
    const eventId = event.id || 'unknown'; // Add an event identifier for better logging

    console.log(`[${new Date().toISOString()}] Received Kafka message: ${JSON.stringify(event)}`);

    try {
        // Handle 'schedule-created' event
        if (event.type === 'schedule-created') {
            const { customerId, startTime, endTime, description } = event;
            console.log(`[${eventId}] Handling 'schedule-created' event for customerId: ${customerId}`);

            const customerEmail = await getCustomerEmail(customerId);
            console.log(`[${eventId}] Fetched customer email: ${customerEmail}`);

            await sendEmail(customerEmail, startTime, endTime, description);
            console.log(`[${eventId}] Email sent successfully to: ${customerEmail}`);
        }

        // Handle 'schedule-updated' event
        if (event.type === 'schedule-updated') {
            const { customerId, startTime, endTime, description } = event;
            console.log(`[${eventId}] Handling 'schedule-updated' event for customerId: ${customerId}`);

            const customerEmail = await getCustomerEmail(customerId);
            console.log(`[${eventId}] Fetched customer email: ${customerEmail}`);

            await sendEmail(customerEmail, startTime, endTime, description);
            console.log(`[${eventId}] Email sent successfully to: ${customerEmail}`);
        }

        // Handle 'schedule-deleted' event
        if (event.type === 'schedule-deleted') {
            console.log(`[${eventId}] Schedule ${event.id} was deleted.`);
        }

    } catch (error) {
        console.error(`[${eventId}] Error processing event:`, error);
    }
});

// Error handling for Kafka consumer
consumer.on('error', (err) => {
    console.error('Error consuming Kafka message:', err);
});

// Fetch customer email (replace with actual Customer Service API request)
const getCustomerEmail = async (customerId) => {
    try {
        console.log(`[Fetching] Fetching customer email for customerId: ${customerId}`);
        const response = await axios.get(`http://customer-service:3000/customers/${customerId}`);
        console.log(`[Fetched] Customer details: ${JSON.stringify(response.data)}`);

        return response.data.email;

    } catch (error) {
        console.error(`[Error] Error fetching customer email for customerId: ${customerId}`, error);
        throw new Error('Unable to fetch customer email');
    }
};

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('Received SIGINT, closing Kafka consumer...');
    consumer.close(true, () => {
        console.log('Kafka consumer closed gracefully');
        process.exit();
    });
});
