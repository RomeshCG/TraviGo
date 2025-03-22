const mongoose = require('mongoose');

const vehicleProviderSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  vehicleType: { type: String, required: true }, // e.g., "Car", "Van", "Bus"
  vehicleModel: { type: String, required: true },
  licensePlate: { type: String, required: true },
  insuranceDetails: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VehicleProvider', vehicleProviderSchema);