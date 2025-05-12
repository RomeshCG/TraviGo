const express = require('express');
const router = express.Router();
const VehicleReview = require('../models/VehicleReview');

// Get reviews for a specific vehicle
router.get('/vehicle/:vehicleId', async (req, res) => {
  try {
    const reviews = await VehicleReview.find({ vehicleId: req.params.vehicleId });
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this vehicle' });
    }
    res.status(200).json({ reviews });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new review for a vehicle
router.post('/vehicle/:vehicleId', async (req, res) => {
  const { userId, userName, comment, rating } = req.body;

  if (!userId || !userName || !comment || !rating) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newReview = new VehicleReview({
      vehicleId: req.params.vehicleId,
      userId,
      userName,
      comment,
      rating,
    });

    await newReview.save();
    res.status(201).json({ message: 'Review added successfully', review: newReview });
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;