const BillingService = require('./billingService');
const cron = require('node-cron');
const axios = require('axios');

const WORKSHOP_SCHEDULER_API = "http://workshop-scheduler-service:5000/schedules" || 'http://localhost:5000/schedules';;

async function checkSchedules() {
    try {
        const response = await axios.get(`${WORKSHOP_SCHEDULER_API}`);
        const schedules = response.data;

        const now = new Date();
        const dueSchedules = schedules.filter(schedule => new Date(schedule.endTime) <= now && schedule.status !== 'notified');

        for (const schedule of dueSchedules) {
            await BillingService.sendInvoice(schedule.id);
            await markAsNotified(schedule.id);
        }
    } catch (error) {
        console.error('Error checking schedules:', error.message);
    }
}

async function markAsNotified(scheduleId) {
    try {
        await axios.patch(`${WORKSHOP_SCHEDULER_API}/${scheduleId}/notify`, { status: 'notified' });
    } catch (error) {
        console.error('Error marking schedule as notified:', error.message);
    }
}

function start() {
    cron.schedule('* * * * *', () => {
        console.log('Running schedule check...');
        checkSchedules();
    });
}

module.exports = { start };
