// Vehicle Order Review Controller
const VehicleOrderReview = require('../models/VehicleOrderReview');
const Order = require('../models/Order');

// Add a review for a completed vehicle order
exports.addReview = async (req, res) => {
  const { orderId, vehicleId, userId, rating, comment } = req.body;
  try {
    // Check if order exists and is completed
    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.status !== 'Completed') return res.status(400).json({ message: 'Order is not completed' });
    // Prevent duplicate review for the same order
    const existing = await VehicleOrderReview.findOne({ orderId });
    if (existing) return res.status(400).json({ message: 'Review already submitted for this order' });
    // Create review
    const review = new VehicleOrderReview({ orderId, vehicleId, userId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review submitted', review });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
};

// Get all reviews for a vehicle
exports.getReviewsForVehicle = async (req, res) => {
  const { vehicleId } = req.params;
  try {
    const reviews = await VehicleOrderReview.find({ vehicleId }).populate('userId', 'name');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// Get review for a specific order (to check if user already reviewed)
exports.getReviewForOrder = async (req, res) => {
  const { orderId } = req.params;
  try {
    const review = await VehicleOrderReview.findOne({ orderId });
    res.status(200).json({ review: review || null });
  } catch (err) {
    console.error('[VehicleOrderReview] getReviewForOrder ERROR', err); // DEBUG
    res.status(500).json({ message: 'Failed to fetch review', error: err.message });
  }
};
