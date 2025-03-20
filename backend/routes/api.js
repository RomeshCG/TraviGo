const express = require('express');
const router = express.Router();
const User = require('../models/user')
const multer = require('multer');



// Test route (already exists)
router.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Register route
router.post('/register', async (req, res) => {
  const { username, password, email, phoneNumber, country } = req.body;

  // Basic validation
  if (!username || !password || !email || !phoneNumber || !country) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const newUser = new User({
      username,
      password, // For now, storing plain password (not secure, add bcrypt later)
      email,
      phoneNumber,
      country,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;