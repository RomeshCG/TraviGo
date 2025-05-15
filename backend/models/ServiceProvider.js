const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  providerType: { type: String, enum: ['HotelProvider', 'TourGuide', 'VehicleProvider'], required: true },
  isAdvancedRegistrationComplete: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);