const express = require('express');
const BillingController = require('../controllers/billingController');

const router = express.Router();

router.post('/notify', BillingController.sendInvoice);

module.exports = router;
