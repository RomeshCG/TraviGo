const express = require('express');
const router = express.Router();
const User = require('../models/user')
const ServiceProvider = require('../models/ServiceProvider');
const HotelOwner = require('../models/HotelOwner');
const TourGuide = require('../models/TourGuide');
const VehicleProvider = require('../models/VehicleProvider');
const multer = require('multer');
const path = require('path');



// Test route (already exists)
router.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Register route for users (Tourists)
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

//Login Route for users (Tourists)
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


//service provider login
router.post('/service-provider/register', async (req, res) => {
  const { name, email, password, providerType } = req.body;
  if (!name || !email || !password || !providerType) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  if (!['HotelProvider', 'TourGuide', 'VehicleProvider'].includes(providerType)) {
    return res.status(400).json({ message: 'Invalid provider type' });
  }
  try {
    const existingProvider = await ServiceProvider.findOne({ email });
    if (existingProvider) return res.status(400).json({ message: 'Email already exists' });
    const newProvider = new ServiceProvider({ name, email, password, providerType });
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

// tour guide advanced registration
router.post('/service-provider/register-advanced', async (req, res) => {
  const { providerId, providerType, advancedDetails } = req.body;
  if (!providerId || !providerType || !advancedDetails) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const provider = await ServiceProvider.findById(providerId);
    if (!provider) return res.status(404).json({ message: 'Service provider not found' });
    if (provider.providerType !== providerType) {
      return res.status(400).json({ message: 'Provider type mismatch' });
    }

    if (providerType === 'TourGuide') {
      const { yearsOfExperience, languages, certification, bio, location } = advancedDetails;
      if (!yearsOfExperience || !languages || !languages.length || !certification || !bio || !location) {
        return res.status(400).json({ message: 'All tour guide details are required' });
      }
      const tourGuide = new TourGuide({
        providerId,
        name: provider.name,
        yearsOfExperience,
        languages,
        certification,
        bio,
        location,
      });
      await tourGuide.save();
    } // Add other provider types as needed

    provider.isAdvancedRegistrationComplete = true;
    await provider.save();
    res.status(201).json({ message: 'Advanced details registered successfully' });
  } catch (error) {
    console.error('Advanced registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


//service provider login
router.post('/service-provider/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  try {
    const existingProvider = await ServiceProvider.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } });
    if (!existingProvider || existingProvider.password !== password) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }
    res.status(200).json({ message: 'Login successful', provider: existingProvider });
  } catch (error) {
    console.error('Service provider login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// New and Updated Tour Guide Routes
router.post('/tour-guide/create', async (req, res) => {
  const { providerId, name, bio, location, languages, yearsOfExperience, certification } = req.body;
  try {
    const existingTourGuide = await TourGuide.findOne({ providerId });
    if (existingTourGuide) return res.status(400).json({ message: 'Tour guide already exists for this provider' });
    const tourGuide = new TourGuide({
      providerId,
      name,
      bio: bio || '',
      location: location || '',
      languages: languages || [],
      yearsOfExperience: yearsOfExperience || 0,
      certification: certification || '',
    });
    await tourGuide.save();
    res.status(201).json(tourGuide);
  } catch (error) {
    console.error('Tour guide creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/tour-guide/provider/:providerId', async (req, res) => {
  try {
    const tourGuide = await TourGuide.findOne({ providerId: req.params.providerId });
    if (!tourGuide) return res.status(404).json({ message: 'Tour guide not found' });
    res.status(200).json(tourGuide);
  } catch (error) {
    console.error('Error fetching tour guide:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// tour guide tour packages
router.get('/tour-guide/:tourGuideId/tour-packages', async (req, res) => {
  try {
    const tourPackages = await TourPackage.find({ tourGuideId: req.params.tourGuideId });
    res.status(200).json(tourPackages);
  } catch (error) {
    console.error('Fetch tour packages error:', error.stack); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

//tour guide reviews
router.get('/tour-guide/:tourGuideId/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ tourGuideId: req.params.tourGuideId }).populate('touristId', 'username');
    const averageRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
    res.status(200).json({ reviews, averageRating });
  } catch (error) {
    console.error('Fetch reviews error:', error.stack); 
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// new tour packacges
router.post('/tour-guide/tour-package', async (req, res) => {
  const { tourGuideId, title, description, duration, price, location, images, itinerary, maxParticipants } = req.body;
  try {
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) return res.status(404).json({ message: 'Tour guide not found' });
    if (tourGuide.verificationStatus !== 'verified') {
      return res.status(403).json({ message: 'You must be verified to create tour packages' });
    }
    const tourPackage = new TourPackage({
      tourGuideId,
      title,
      description,
      duration,
      price,
      location,
      images: images || [],
      itinerary,
      maxParticipants,
    });
    await tourPackage.save();
    res.status(201).json({ message: 'Tour package created successfully', tourPackage });
  } catch (error) {
    console.error('Tour package creation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// make tour package
router.put('/tour-guide/tour-package/:id/publish', async (req, res) => {
  try {
    const tourPackage = await TourPackage.findById(req.params.id);
    if (!tourPackage) return res.status(404).json({ message: 'Tour package not found' });
    const tourGuide = await TourGuide.findById(tourPackage.tourGuideId);
    if (tourGuide.verificationStatus !== 'verified') {
      return res.status(403).json({ message: 'You must be verified to publish tour packages' });
    }
    tourPackage.status = 'published';
    await tourPackage.save();
    res.status(200).json({ message: 'Tour package published successfully', tourPackage });
  } catch (error) {
    console.error('Tour package publish error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


//tour package delete
router.delete('/tour-guide/tour-package/:id', async (req, res) => {
  try {
    const tourPackage = await TourPackage.findById(req.params.id);
    if (!tourPackage) return res.status(404).json({ message: 'Tour package not found' });
    const tourGuide = await TourGuide.findById(tourPackage.tourGuideId);
    if (tourGuide.verificationStatus !== 'verified') {
      return res.status(403).json({ message: 'You must be verified to delete tour packages' });
    }
    await tourPackage.remove();
    res.status(200).json({ message: 'Tour package deleted successfully' });
  } catch (error) {
    console.error('Tour package delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;