const mongoose = require('mongoose');

const tourGuideBookingSchema = new mongoose.Schema({
  tourGuideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourGuide',
    required: true,
  },
  touristId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tourist',
    required: true,
  },
  tourPackageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourPackage',
    required: true,
  },
  bookingDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('TourGuideBooking', tourGuideBookingSchema);