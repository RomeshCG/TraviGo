// VehicleOrderReview.js
const mongoose = require('mongoose');

const vehicleOrderReviewSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true }, // One review per order
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'RentingVehicle', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('VehicleOrderReview', vehicleOrderReviewSchema);
