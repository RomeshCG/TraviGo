const express = require('express');
const router = express.Router();
const hotelBookingReviewController = require('../controllers/hotelBookingReviewController');

// Add a review for a completed booking
router.post('/', hotelBookingReviewController.addReview);

// Get all reviews for a hotel
router.get('/hotel/:hotelId', hotelBookingReviewController.getReviewsForHotel);

// Get review for a specific booking
router.get('/booking/:bookingId', hotelBookingReviewController.getReviewForBooking);

module.exports = router;