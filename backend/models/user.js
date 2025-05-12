const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true },
  country: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  profilePicture: { type: String, default: 'https://via.placeholder.com/150' },
  bankDetails: {
    accountHolderName: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    branch: { type: String },
    swiftCode: { type: String },
  },
});

// Prevent OverwriteModelError by checking if model is already compiled
const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;