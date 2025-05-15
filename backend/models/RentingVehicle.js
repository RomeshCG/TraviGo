const mongoose = require('mongoose');

const rentingVehicleSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  vehicleType: { type: String, required: true },
  vehicleName: { type: String, required: true },
  location: { type: String, required: true },
  pricePerDay: { type: Number, required: true },
  engine: { type: String, required: true },
  seats: { type: Number, required: true },
  doors: { type: Number, required: true },
  fuelType: { type: String, required: true },
  transmission: { type: String, required: true },
  description: { type: String, required: true },
  images: [String],
  availability: [
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
    },
  ], // New field for unavailable dates
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RentingVehicle', rentingVehicleSchema);