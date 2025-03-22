const mongoose = require('mongoose');

const tourGuideSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  yearsOfExperience: { type: Number, required: true },
  languages: [{ type: String, required: true }],
  certification: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TourGuide', tourGuideSchema);