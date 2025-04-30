const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const Vehicle = require('../models/Vehicle');

const router = express.Router();

// Configure Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'vehicles',
    allowed_formats: ['jpg', 'png', 'jpeg'],
    resource_type: 'image',
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only JPG, PNG, and JPEG images are allowed'));
  },
});

// Add a new vehicle
router.post(
  '/vehicles/add',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'imageArray', maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const {
        name,
        location,
        price,
        engine,
        doors,
        seats,
        fuel,
        transmission,
        description,
      } = req.body;

      if (!name || !location || !price || !engine || !doors || !seats || !fuel || !transmission || !description || !req.files['image']) {
        return res.status(400).json({ error: 'All fields and a main image are required' });
      }

      const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
      const parsedDoors = parseInt(doors, 10);
      const parsedSeats = parseInt(seats, 10);

      if (isNaN(parsedPrice) || isNaN(parsedDoors) || isNaN(parsedSeats)) {
        return res.status(400).json({ error: 'Price, doors, and seats must be valid numbers' });
      }

      const imageUrl = req.files['image'][0].path;
      const imageArrayUrls = req.files['imageArray']?.map((file) => file.path) || [];

      const newVehicle = new Vehicle({
        name,
        location,
        image: imageUrl,
        imageArray: imageArrayUrls,
        price: parsedPrice,
        engine,
        doors: parsedDoors,
        seats: parsedSeats,
        fuel,
        transmission,
        description,
      });

      const savedVehicle = await newVehicle.save();
      res.status(201).json(savedVehicle);
    } catch (err) {
      console.error('Add Vehicle Error:', err);
      res.status(500).json({ error: 'Failed to add vehicle: ' + err.message });
    }
  }
);

// Get all vehicles
router.get('/vehicles', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json(vehicles);
  } catch (err) {
    console.error('Fetch Vehicles Error:', err);
    res.status(500).json({ error: 'Failed to fetch vehicles: ' + err.message });
  }
});

// Get a single vehicle by ID
router.get('/vehicles/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
  } catch (err) {
    console.error('Fetch Vehicle Error:', err);
    res.status(500).json({ error: 'Failed to fetch vehicle: ' + err.message });
  }
});

// Update a vehicle
router.put(
  '/vehicles/update/:id',
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'imageArray', maxCount: 5 },
  ]),
  async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      const {
        name,
        location,
        price,
        engine,
        doors,
        seats,
        fuel,
        transmission,
        description,
      } = req.body;

      if (name) vehicle.name = name;
      if (location) vehicle.location = location;
      if (price) {
        const parsedPrice = parseFloat(price.replace(/[^0-9.]/g, ''));
        if (isNaN(parsedPrice)) {
          return res.status(400).json({ error: 'Price must be a valid number' });
        }
        vehicle.price = parsedPrice;
      }
      if (engine) vehicle.engine = engine;
      if (doors) {
        const parsedDoors = parseInt(doors, 10);
        if (isNaN(parsedDoors)) {
          return res.status(400).json({ error: 'Doors must be a valid number' });
        }
        vehicle.doors = parsedDoors;
      }
      if (seats) {
        const parsedSeats = parseInt(seats, 10);
        if (isNaN(parsedSeats)) {
          return res.status(400).json({ error: 'Seats must be a valid number' });
        }
        vehicle.seats = parsedSeats;
      }
      if (fuel) vehicle.fuel = fuel;
      if (transmission) vehicle.transmission = transmission;
      if (description) vehicle.description = description;

      if (req.files['image']) {
        vehicle.image = req.files['image'][0].path;
      }
      if (req.files['imageArray']) {
        vehicle.imageArray = req.files['imageArray'].map((file) => file.path);
      }

      const updatedVehicle = await vehicle.save();
      res.status(200).json(updatedVehicle);
    } catch (err) {
      console.error('Update Vehicle Error:', err);
      res.status(500).json({ error: 'Failed to update vehicle: ' + err.message });
    }
  }
);

// Delete a vehicle
router.delete('/vehicles/delete/:id', async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    if (vehicle.image) {
      const publicId = vehicle.image.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`vehicles/${publicId}`);
    }
    if (vehicle.imageArray.length > 0) {
      const deletePromises = vehicle.imageArray.map((url) => {
        const publicId = url.split('/').pop().split('.')[0];
        return cloudinary.uploader.destroy(`vehicles/${publicId}`);
      });
      await Promise.all(deletePromises);
    }
    res.status(200).json({ message: 'Vehicle deleted successfully' });
  } catch (err) {
    console.error('Delete Vehicle Error:', err);
    res.status(500).json({ error: 'Failed to delete vehicle: ' + err.message });
  }
});

module.exports = router;