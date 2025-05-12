const RentingVehicle = require('../models/RentingVehicle');
const { v2: cloudinary } = require('cloudinary');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Add a new renting vehicle
exports.addRentingVehicle = async (req, res) => {
  try {
    const {
      providerId,
      vehicleType,
      vehicleName,
      location,
      pricePerDay,
      engine,
      seats,
      doors,
      fuelType,
      transmission,
      description,
    } = req.body;

    // Validate required fields
    if (!providerId || !vehicleType || !vehicleName || !location || !pricePerDay || !engine || !seats || !doors || !fuelType || !transmission || !description) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Handle image uploads
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadRes = await cloudinary.uploader.upload(file.path, {
          folder: 'renting_vehicles',
        });
        imageUrls.push(uploadRes.secure_url);
      }
    }

    const newVehicle = new RentingVehicle({
      providerId,
      vehicleType,
      vehicleName,
      location,
      pricePerDay,
      engine,
      seats,
      doors,
      fuelType,
      transmission,
      description,
      images: imageUrls,
    });

    await newVehicle.save();
    res.status(201).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all renting vehicles
exports.getAllRentingVehicles = async (req, res) => {
  try {
    const vehicles = await RentingVehicle.find().sort({ createdAt: -1 });
    res.json({ vehicles });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch vehicles', error: error.message });
  }
};

// Get a single renting vehicle by ID
exports.getRentingVehicleById = async (req, res) => {
  try {
    const vehicle = await RentingVehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ vehicle });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Rent a vehicle
exports.rentVehicle = async (req, res) => {
  try {
    const { vehicleId, fullName, email, phone, startDate, endDate } = req.body;
    if (!vehicleId || !fullName || !email || !phone || !startDate || !endDate) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    // You can add more logic here, e.g., check vehicle availability, save booking, send email, etc.
    // For now, just return success
    res.status(200).json({ message: 'Vehicle rented successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create Stripe payment intent for renting vehicle
exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body;
    if (!amount) return res.status(400).json({ message: 'Amount is required' });
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment intent', error: error.message });
  }
};