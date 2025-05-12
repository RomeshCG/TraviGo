const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'RentingVehicle', required: true }, // Updated reference
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Capitalize 'User' for consistency
    userName: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    totalPrice: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Pay Upon Arrival', 'Card'], required: true },
    status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);