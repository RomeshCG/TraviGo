const mongoose = require('mongoose');

const TourBookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourGuide',
    required: true,
  },
  packageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TourPackage',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  travelersCount: {
    type: Number,
    required: true,
  },
  travelDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'approved', 'rejected'],
    default: 'pending',
  },
  adminNotified: {
    type: Boolean,
    default: false,
  },
  refundRequested: {
    type: Boolean,
    default: false,
  },
  payoutReady: {
    type: Boolean,
    default: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('TourBooking', TourBookingSchema);