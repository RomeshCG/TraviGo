const mongoose = require('mongoose');

const tourGuideSchema = new mongoose.Schema({
  providerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  bio: String,
  location: String,
  languages: [String],
  yearsOfExperience: Number,
  certification: String,
  verificationStatus: { type: String, default: 'pending' },
  verifiedBadge: { type: Boolean, default: false },
  profilePicture: { type: String, default: '' },
  banner: { type: String },
});

module.exports = mongoose.model('TourGuide', tourGuideSchema);