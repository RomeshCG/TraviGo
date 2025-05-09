const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  tourGuideId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourGuide', required: true },
  touristId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reviewerType: { type: String, enum: ['tourist', 'guide'], required: true }, // Who wrote the review
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  complaint: {
    type: String,
    default: '',
  },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourBookings', required: true },
  createdAt: { type: Date, default: Date.now },
  // For guide reviewing tourist, touristId is the reviewed user, guideId is the reviewer
  // For tourist reviewing guide, tourGuideId is the reviewed guide, touristId is the reviewer
});

module.exports = mongoose.model('Review', reviewSchema);