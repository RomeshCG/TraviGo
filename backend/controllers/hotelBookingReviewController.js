const HotelBookingReview = require('../models/HotelBookingReview');
const Booking = require('../models/Booking');

// Add a review for a completed hotel booking
exports.addReview = async (req, res) => {
  const { bookingId, hotelId, userId, rating, comment } = req.body;
  try {
    // Check if booking exists and is completed
    const booking = await Booking.findById(bookingId);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    if (booking.status !== 'completed') return res.status(400).json({ message: 'Booking is not completed' });

    // Prevent duplicate reviews for the same booking
    const existingReview = await HotelBookingReview.findOne({ bookingId });
    if (existingReview) return res.status(400).json({ message: 'Review already submitted for this booking' });

    // Create the review
    const review = new HotelBookingReview({ bookingId, hotelId, userId, rating, comment });
    await review.save();
    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit review', error: err.message });
  }
};

// Get all reviews for a hotel
exports.getReviewsForHotel = async (req, res) => {
  const { hotelId } = req.params;
  try {
    const reviews = await HotelBookingReview.find({ hotelId }).populate('userId', 'name');
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews', error: err.message });
  }
};

// Get review for a specific booking
exports.getReviewForBooking = async (req, res) => {
  const { bookingId } = req.params;
  try {
    const review = await HotelBookingReview.findOne({ bookingId });
    res.status(200).json({ review: review || null });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch review', error: err.message });
  }
};