const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { addRentingVehicle, getAllRentingVehicles, getRentingVehicleById, rentVehicle, createPaymentIntent, updateRentingVehicle } = require('../controllers/rentingVehicleController');
const Order = require('../models/Order'); // Import the Order model

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Add a new renting vehicle
router.post('/add', upload.array('images', 5), addRentingVehicle);

// Get all renting vehicles
router.get('/', getAllRentingVehicles);

// Get a single renting vehicle by ID
router.get('/:id', getRentingVehicleById);

// Rent a vehicle
router.post('/rent', rentVehicle);

// Stripe payment intent for renting vehicle
router.post('/create-payment-intent', createPaymentIntent);

// Update a renting vehicle
router.put('/:id', updateRentingVehicle);

// Delete a renting vehicle by ID
router.delete('/:id', async (req, res) => {
  try {
    const RentingVehicle = require('../models/RentingVehicle');
    const vehicle = await RentingVehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete vehicle', error: err.message });
  }
});

// Place an order
router.post('/place-order', async (req, res) => {
  const { vehicleId, userId, userName, startDate, endDate, totalPrice, paymentMethod } = req.body;

  try {
    // Save the order to the database
    const order = new Order({
      vehicleId,
      userId, // Save userId
      userName,
      startDate,
      endDate,
      totalPrice,
      paymentMethod,
    });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
});

module.exports = router;