const mongoose = require('mongoose');

const cashoutRequestSchema = new mongoose.Schema({
  tourGuideId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourGuide', required: true },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TourBooking' }],
  requestedAt: { type: Date, default: Date.now },
  processedAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('CashoutRequest', cashoutRequestSchema);