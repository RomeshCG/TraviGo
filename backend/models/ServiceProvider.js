const mongoose = require('mongoose');

const serviceProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // In a real app, hash this with bcrypt
  providerType: { 
    type: String, 
    required: true, 
    enum: ['HotelProvider', 'TourGuide', 'VehicleProvider'] 
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ServiceProvider', serviceProviderSchema);