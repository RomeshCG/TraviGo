const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String, required: true },
  imageArray: { type: [String], default: [] },
  price: { type: Number, required: true },
  engine: { type: String, required: true },
  doors: { type: Number, required: true },
  seats: { type: Number, required: true },
  fuel: { type: String, required: true },
  transmission: { type: String, required: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model('Vehicle', vehicleSchema);