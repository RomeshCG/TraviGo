const mongoose = require('mongoose');

const vehicleProviderSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  phoneNumber: { type: String, required: true }, // Added phone number
  address: { type: String, required: true }, // Added address
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VehicleProvider', vehicleProviderSchema);