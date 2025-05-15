// tourguide.js
const mongoose = require('mongoose');

const tourGuideSchema = new mongoose.Schema({
  providerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  bio: String,
  location: String,
  languages: [String],
  yearsOfExperience: Number,
  certification: String,
  verificationStatus: { 
    type: String, 
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending' 
  },
  verifiedBadge: { type: Boolean, default: false },
  isBanned: { type: Boolean, default: false }, // Added banned status
  profilePicture: { type: String, default: '' },
  banner: { type: String },
  bankDetails: {
    accountHolderName: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    branch: { type: String },
    swiftCode: { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model('TourGuide', tourGuideSchema);