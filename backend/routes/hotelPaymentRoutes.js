const express = require('express');
const { createPaymentIntent } = require('../controllers/hotelPaymentController');
const router = express.Router();

router.post('/create-payment-intent', createPaymentIntent);

module.exports = router;