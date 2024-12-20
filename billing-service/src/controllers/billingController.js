const BillingService = require('../services/billingService');

exports.sendInvoice = async (req, res, next) => {
    try {
        const { scheduleId } = req.params;
        if (!scheduleId) {
            return res.status(400).json({ error: 'Schedule ID is required.' });
        }

        const result = await BillingService.sendInvoice(scheduleId);

        return res.status(200).json({
            message: 'Invoice sent successfully!',
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
