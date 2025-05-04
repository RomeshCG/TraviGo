const express = require('express');
const router = express.Router();
const TourBooking = require('../models/TourBookings');

// Mark a tour booking as completed
router.put('/:id/complete', async (req, res) => {
  try {
    const booking = await TourBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    booking.status = 'completed';
    await booking.save();
    res.status(200).json({ message: 'Booking marked as completed', booking });
  } catch (error) {
    console.error('Complete booking error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
