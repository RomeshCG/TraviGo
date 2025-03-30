const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Add jsonwebtoken
const User = require('../models/user');
const Admin = require('../models/Admin');
const ServiceProvider = require('../models/ServiceProvider');
const HotelOwner = require('../models/HotelOwner');
const TourGuide = require('../models/TourGuide');
const VehicleProvider = require('../models/VehicleProvider');
const TourPackage = require('../models/TourPackage');
const Review = require('../models/Review');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const TourGuideBooking = require('../models/TourBookings');
const ContactMessage = require('../models/ContactMessage');


// Load environment variables
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in .env file');
  process.exit(1);
}

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Config multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});
const upload = multer({ storage });

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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      password: hashedPassword,
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

// Login Route for users (Tourists)
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

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    // Generate JWT token for user
    const token = jwt.sign(
      { id: existingUser._id, username: existingUser.username },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const userResponse = {
      _id: existingUser._id,
      username: existingUser.username,
      email: existingUser.email,
      phoneNumber: existingUser.phoneNumber,
      country: existingUser.country,
    };

    res.status(200).json({ message: 'Login successful', user: userResponse, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/user/update-profile', async (req, res) => {
  try {
    const { userId, email, phoneNumber, country, address } = req.body;

    // Validate required fields
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the new email is already in use by another user
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
    }

    // Update fields
    user.email = email || user.email;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.country = country || user.country;
    user.address = address || user.address;

    await user.save();

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      country: user.country,
      address: user.address,
      profilePicture: user.profilePicture,
    };

    res.status(200).json({ message: 'Profile updated successfully', user: userResponse });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify User Token
router.get('/verify-token', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      message: 'Token is valid',
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        phoneNumber: user.phoneNumber,
        country: user.country,
      },
    });
  } catch (error) {
    console.error('User token verification error:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
});

// Get user by ID
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      phoneNumber: user.phoneNumber,
      country: user.country,
      createdAt: user.createdAt,
      profilePicture: user.profilePicture || 'https://via.placeholder.com/150',
    };
    res.status(200).json(userResponse);
  } catch (error) {
    console.error('Fetch user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add profile picture user
router.put('/user/update-profile-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId || !req.file) {
      return res.status(400).json({ message: 'User ID and profile picture file are required' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.profilePicture = `/uploads/${req.file.filename}`;
    await user.save();
    res.status(200).json({ message: 'Profile picture updated successfully', user });
  } catch (error) {
    console.error('Update user profile picture error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Route to handle contact form submission
router.post('/contact', async (req, res) => {
  try {
    const { firstName, lastName, email, phone, message } = req.body;

    if (!firstName || !lastName || !email || !phone || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newMessage = new ContactMessage({
      firstName,
      lastName,
      email,
      phone,
      message,
    });

    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully! We will get back to you soon.' });
  } catch (error) {
    console.error('Contact form submission error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

// Service provider registration
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

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newProvider = new ServiceProvider({
      name,
      email,
      password: hashedPassword,
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

// Tour guide advanced registration
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

// Tour guide profile picture updates route
router.put('/tour-guide/update-profile-picture', upload.single('profilePicture'), async (req, res) => {
  try {
    const { tourGuideId } = req.body;
    if (!tourGuideId || !req.file) {
      return res.status(400).json({ message: 'Tour guide ID and profile picture file are required' });
    }
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }
    tourGuide.profilePicture = `/uploads/${req.file.filename}`;
    await tourGuide.save();
    res.status(200).json({ message: 'Profile picture updated successfully', tourGuide });
  } catch (error) {
    console.error('Update profile picture error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Service provider login
router.post('/service-provider/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });
  try {
    const existingProvider = await ServiceProvider.findOne({ email: { $regex: new RegExp(`^${email.trim()}$`, 'i') } });
    if (!existingProvider) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, existingProvider.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token for service provider
    const token = jwt.sign(
      { id: existingProvider._id, email: existingProvider.email, providerType: existingProvider.providerType },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const providerResponse = {
      _id: existingProvider._id,
      name: existingProvider.name,
      email: existingProvider.email,
      providerType: existingProvider.providerType,
      isAdvancedRegistrationComplete: existingProvider.isAdvancedRegistrationComplete,
    };

    res.status(200).json({ message: 'Login successful', provider: providerResponse, token });
  } catch (error) {
    console.error('Service provider login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Service Provider Token
router.get('/verify-provider-token', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const provider = await ServiceProvider.findById(decoded.id);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    res.status(200).json({
      message: 'Token is valid',
      provider: {
        _id: provider._id,
        name: provider.name,
        email: provider.email,
        providerType: provider.providerType,
        isAdvancedRegistrationComplete: provider.isAdvancedRegistrationComplete,
      },
    });
  } catch (error) {
    console.error('Provider token verification error:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
});

// Update tour guide profile
router.put('/tour-guide/update-profile', async (req, res) => {
  try {
    const { tourGuideId, name, bio, location, languages, yearsOfExperience, certification } = req.body;
    if (!tourGuideId) {
      return res.status(400).json({ message: 'Tour guide ID is required' });
    }
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }
    tourGuide.name = name || tourGuide.name;
    tourGuide.bio = bio || tourGuide.bio;
    tourGuide.location = location || tourGuide.location;
    tourGuide.languages = languages || tourGuide.languages;
    tourGuide.yearsOfExperience = yearsOfExperience !== undefined ? yearsOfExperience : tourGuide.yearsOfExperience;
    tourGuide.certification = certification || tourGuide.certification;
    await tourGuide.save();
    res.status(200).json({ message: 'Profile updated successfully', tourGuide });
  } catch (error) {
    console.error('Update profile error:', error);
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

// Tour guide tour packages
router.get('/tour-guide/:tourGuideId/tour-packages', async (req, res) => {
  try {
    const { tourGuideId } = req.params;

    // Validate tourGuideId
    if (!mongoose.Types.ObjectId.isValid(tourGuideId)) {
      return res.status(400).json({ message: 'Invalid tour guide ID' });
    }

    // Check if tour guide exists
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    const tourPackages = await TourPackage.find({ tourGuideId });
    res.status(200).json(tourPackages);
  } catch (error) {
    console.error('Fetch tour packages error:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Tour guide bookings
router.get('/tour-guide/:tourGuideId/tour-guide-bookings', async (req, res) => {
  try {
    const { tourGuideId } = req.params;
    const tourGuideBookings = await TourGuideBooking.find({ tourGuideId })
      .populate('touristId', 'username')
      .populate('tourPackageId', 'title');
    if (!tourGuideBookings || tourGuideBookings.length === 0) {
      return res.status(404).json({ message: 'No tour guide bookings found' });
    }
    res.status(200).json(tourGuideBookings);
  } catch (error) {
    console.error('Fetch tour guide bookings error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Tour guide reviews
router.get('/tour-guide/:tourGuideId/reviews', async (req, res) => {
  try {
    const { tourGuideId } = req.params;

    // Validate tourGuideId
    if (!mongoose.Types.ObjectId.isValid(tourGuideId)) {
      return res.status(400).json({ message: 'Invalid tour guide ID' });
    }

    // Check if tour guide exists
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }

    const reviews = await Review.find({ tourGuideId }).populate('touristId', 'username');
    const averageRating = reviews.length
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;
    res.status(200).json({ reviews, averageRating });
  } catch (error) {
    console.error('Fetch reviews error:', error.stack);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// New tour packages
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

// Make tour package
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

// Tour package delete
router.delete('/tour-guide/tour-package/:id', async (req, res) => {
  try {
    const tourPackage = await TourPackage.findById(req.params.id);
    if (!tourPackage) return res.status(404).json({ message: 'Tour package not found' });
    const tourGuide = await TourGuide.findById(tourPackage.tourGuideId);
    if (tourGuide.verificationStatus !== 'verified') {
      return res.status(403).json({ message: 'You must be verified to delete tour packages' });
    }
    await tourPackage.deleteOne();
    res.status(200).json({ message: 'Tour package deleted successfully' });
  } catch (error) {
    console.error('Tour package delete error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Tour guide banner upload route
router.put('/tour-guide/update-banner', upload.single('banner'), async (req, res) => {
  try {
    const { tourGuideId } = req.body;
    if (!tourGuideId || !req.file) {
      return res.status(400).json({ message: 'Tour guide ID and banner file are required' });
    }
    const tourGuide = await TourGuide.findById(tourGuideId);
    if (!tourGuide) {
      return res.status(404).json({ message: 'Tour guide not found' });
    }
    tourGuide.banner = `/uploads/${req.file.filename}`;
    await tourGuide.save();
    res.status(200).json({ message: 'Banner updated successfully', tourGuide });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//get tour guides to the list
router.get('/tour-guides', async (req, res) => {
  try {
    const tourGuides = await TourGuide.find(); // Fetch all tour guides directly
    console.log('Fetched tour guides (direct):', tourGuides);
    res.json(tourGuides);
  } catch (error) {
    console.error('Error fetching tour guides:', error);
    res.status(500).json({ message: 'Error fetching tour guides', error });
  }
});


// Admin Registration Route
router.post('/admin/register', verifyAdminToken, async (req, res) => {
  const { username, email, password, adminToken } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
    });

    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    console.error('Admin registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Admin Login Route
router.post('/admin/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const adminResponse = {
      _id: admin._id,
      username: admin.username,
      email: admin.email,
    };

    res.status(200).json({ message: 'Admin login successful', admin: adminResponse, token });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify Admin Token
router.get('/verify-admin-token', async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Expecting "Bearer <token>"
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    res.status(200).json({
      message: 'Token is valid',
      admin: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    console.error('Admin token verification error:', error);
    res.status(403).json({ message: 'Invalid or expired token' });
  }
});


const isAdmin = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }
    req.adminId = decoded.id;
    next();
  } catch (error) {
    res.status(403).json({ message: 'Invalid or expired token' });
  }
};

// Get all tour guides
router.get('/tourguides', isAdmin, async (req, res) => {
  try {
    const tourGuides = await TourGuide.find()
      .select('-__v') // Exclude version key
      .lean(); // Convert to plain JavaScript object
    res.json(tourGuides);
  } catch (error) {
    console.error('Error fetching tour guides:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify tour guide
router.put('/tourguides/verify/:id', isAdmin, async (req, res) => {
  try {
    const tourGuide = await TourGuide.findById(req.params.id);
    if (!tourGuide) return res.status(404).json({ message: 'Tour guide not found' });

    tourGuide.verificationStatus = 'verified';
    tourGuide.verifiedBadge = true;
    await tourGuide.save();
    res.json(tourGuide);
  } catch (error) {
    console.error('Error verifying tour guide:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unverify tour guide
router.put('/tourguides/unverify/:id', isAdmin, async (req, res) => {
  try {
    const tourGuide = await TourGuide.findById(req.params.id);
    if (!tourGuide) return res.status(404).json({ message: 'Tour guide not found' });

    tourGuide.verificationStatus = 'pending';
    tourGuide.verifiedBadge = false;
    await tourGuide.save();
    res.json(tourGuide);
  } catch (error) {
    console.error('Error unverifying tour guide:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Ban tour guide
router.put('/tourguides/ban/:id', isAdmin, async (req, res) => {
  try {
    const tourGuide = await TourGuide.findById(req.params.id);
    if (!tourGuide) return res.status(404).json({ message: 'Tour guide not found' });

    tourGuide.isBanned = true;
    await tourGuide.save();
    res.json(tourGuide);
  } catch (error) {
    console.error('Error banning tour guide:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Unban tour guide
router.put('/tourguides/unban/:id', isAdmin, async (req, res) => {
  try {
    const tourGuide = await TourGuide.findById(req.params.id);
    if (!tourGuide) return res.status(404).json({ message: 'Tour guide not found' });

    tourGuide.isBanned = false;
    await tourGuide.save();
    res.json(tourGuide);
  } catch (error) {
    console.error('Error unbanning tour guide:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete tour guide
router.delete('/tourguides/:id', isAdmin, async (req, res) => {
  try {
    const tourGuide = await TourGuide.findByIdAndDelete(req.params.id);
    if (!tourGuide) return res.status(404).json({ message: 'Tour guide not found' });
    res.json({ message: 'Tour guide deleted successfully' });
  } catch (error) {
    console.error('Error deleting tour guide:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate registration token
router.post('/api/admin/generate-registration-token', isAdmin, async (req, res) => {
  try {
    const registrationToken = jwt.sign(
      { issuer: req.adminId, purpose: 'admin-registration' },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );
    res.status(200).json({ token: registrationToken });
  } catch (error) {
    console.error('Token generation error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});



module.exports = router;