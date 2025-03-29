const mongoose = require('mongoose');

const hotelOwnerSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  hotelName: { type: String, required: true },
  hotelAddress: { type: String, required: true },
  hotelLicenseNumber: { type: String, required: true },
  numberOfRooms: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('HotelOwner', hotelOwnerSchema);