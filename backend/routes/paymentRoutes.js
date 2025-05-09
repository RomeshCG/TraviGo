const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const { body, validationResult } = require('express-validator');
const verifyUser = require('../middleware/verifyToken')('User');

// Create a Payment Intent
router.post(
  '/create-payment-intent',
  verifyUser,
  [
    body('amount').isFloat({ min: 0.5 }).withMessage('Amount must be at least $0.50'),
    body('bookingId').notEmpty().withMessage('Booking ID is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { amount, bookingId } = req.body;
    const userId = req.userId;

    try {
      // Verify booking exists and belongs to the user
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        console.log(`Booking not found for _id: ${bookingId}`);
        return res.status(404).json({ success: false, message: 'Booking not found' });
      }
      if (booking.userId.toString() !== userId) {
        console.log(`Unauthorized access to booking: ${bookingId} by user: ${userId}`);
        return res.status(403).json({ success: false, message: 'Unauthorized' });
      }
      if (Math.abs(booking.totalPrice - amount) > 0.01) {
        console.log(`Amount mismatch: booking=${booking.totalPrice}, provided=${amount}`);
        return res.status(400).json({ success: false, message: 'Amount mismatch' });
      }

      // Create Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        payment_method_types: ['card'],
        metadata: { bookingId, userId },
      });

      console.log(`Payment Intent created: ${paymentIntent.id}`);
      res.status(200).json({ success: true, clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Payment Intent error:', error.stack);
      res.status(500).json({ success: false, message: 'Failed to create payment intent', error: error.message });
    }
  }
);

// Update booking status after payment
router.post('/confirm-payment', verifyUser, async (req, res) => {
  const { bookingId, paymentIntentId } = req.body;
  const userId = req.userId;

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      console.log(`Booking not found for _id: ${bookingId}`);
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (booking.userId.toString() !== userId) {
      console.log(`Unauthorized access to booking: ${bookingId} by user: ${userId}`);
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Verify Payment Intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      console.log(`Payment not successful: ${paymentIntentId}, status: ${paymentIntent.status}`);
      return res.status(400).json({ success: false, message: 'Payment not successful' });
    }

    // Update booking
    booking.paymentStatus = 'completed';
    booking.status = 'confirmed';
    await booking.save();

    console.log(`Booking updated: ${bookingId}, paymentStatus: completed`);
    res.status(200).json({ success: true, message: 'Payment confirmed', booking });
  } catch (error) {
    console.error('Payment confirmation error:', error.stack);
    res.status(500).json({ success: false, message: 'Failed to confirm payment', error: error.message });
  }
});

module.exports = router;