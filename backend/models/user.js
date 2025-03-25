const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  profilePicture: { type: String, default: 'https://via.placeholder.com/150' }, // Add this field
});

module.exports = mongoose.model('User', userSchema);