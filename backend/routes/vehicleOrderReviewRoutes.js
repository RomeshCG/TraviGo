// Vehicle Order Review Routes
const express = require('express');
const router = express.Router();
const vehicleOrderReviewController = require('../controllers/vehicleOrderReviewController');

// Add a review for a completed order
router.post('/', vehicleOrderReviewController.addReview);

// Get all reviews for a vehicle
router.get('/vehicle/:vehicleId', vehicleOrderReviewController.getReviewsForVehicle);

// Get review for a specific order
router.get('/order/:orderId', vehicleOrderReviewController.getReviewForOrder);

module.exports = router;
