const mongoose = require('mongoose');

const adminHotelSchema = new mongoose.Schema({
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceProvider', required: true },
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  imageArray: [String],
  price: { type: Number, required: true },
  description: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  rooms: [
    {
      type: { type: String, required: true },
      features: { type: String, required: true },
      amenities: { type: String, required: true },
      images: [String],
      price: { type: Number, required: true },
      size: { type: String },
      occupancy: { type: String },
      perks: { type: String },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('AdminHotel', adminHotelSchema);