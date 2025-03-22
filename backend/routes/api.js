const express = require('express');
const router = express.Router();
const User = require('../models/user')
const multer = require('multer');
const ServiceProvider = require('../models/ServiceProvider');
const HotelOwner = require('../models/HotelOwner');
const TourGuide = require('../models/TourGuide');
const VehicleProvider = require('../models/VehicleProvider');



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
      password,
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


//Login Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    if (existingUser.password !== password) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful', user: existingUser });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



router.post('/service-provider/register', async (req, res) => {
  const { name, email, password, providerType } = req.body;

  if (!name || !email || !password || !providerType) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (!['HotelProvider', 'TourGuide', 'VehicleProvider'].includes(providerType)) {
    return res.status(400).json({ message: 'Invalid provider type' });
  }

  try {
    const existingProvider = await ServiceProvider.findOne({ email }); // Error occurs here
    if (existingProvider) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newProvider = new ServiceProvider({
      name,
      email,
      password,
      providerType,
    });

    await newProvider.save();
    res.status(201).json({ 
      message: 'Basic details registered successfully', 
      providerId: newProvider._id,
      providerType: newProvider.providerType,
    });
  } catch (error) {
    console.error('Service provider registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/service-provider/register-advanced', async (req, res) => {
  const { providerId, providerType, advancedDetails } = req.body;

  if (!providerId || !providerType || !advancedDetails) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }

    if (provider.providerType !== providerType) {
      return res.status(400).json({ message: 'Provider type mismatch' });
    }

    if (providerType === 'HotelProvider') {
      const { hotelName, hotelAddress, hotelLicenseNumber, numberOfRooms } = advancedDetails;
      if (!hotelName || !hotelAddress || !hotelLicenseNumber || !numberOfRooms) {
        return res.status(400).json({ message: 'All hotel details are required' });
      }

      const hotelOwner = new HotelOwner({
        providerId,
        hotelName,
        hotelAddress,
        hotelLicenseNumber,
        numberOfRooms,
      });

      await hotelOwner.save();
    } else if (providerType === 'TourGuide') {
      const { yearsOfExperience, languages, certification } = advancedDetails;
      if (!yearsOfExperience || !languages || !languages.length || !certification) {
        return res.status(400).json({ message: 'All tour guide details are required' });
      }

      const tourGuide = new TourGuide({
        providerId,
        yearsOfExperience,
        languages,
        certification,
      });

      await tourGuide.save();
    } else if (providerType === 'VehicleProvider') {
      const { vehicleType, vehicleModel, licensePlate, insuranceDetails } = advancedDetails;
      if (!vehicleType || !vehicleModel || !licensePlate || !insuranceDetails) {
        return res.status(400).json({ message: 'All vehicle details are required' });
      }

      const vehicleProvider = new VehicleProvider({
        providerId,
        vehicleType,
        vehicleModel,
        licensePlate,
        insuranceDetails,
      });

      await vehicleProvider.save();
    } else {
      return res.status(400).json({ message: 'Invalid provider type' });
    }

    res.status(201).json({ message: 'Advanced details registered successfully' });
  } catch (error) {
    console.error('Advanced registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;