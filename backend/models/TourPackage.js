const mongoose = require('mongoose');

const tourPackageSchema = new mongoose.Schema({
  tourGuideId: { type: mongoose.Schema.Types.ObjectId, ref: 'TourGuide', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  duration: { type: String, required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true },
  images: [String],
  itinerary: { type: String, required: true },
  maxParticipants: { type: Number, required: true },
  status: { type: String, default: 'draft', enum: ['draft', 'published'] },
});

module.exports = mongoose.model('TourPackage', tourPackageSchema);