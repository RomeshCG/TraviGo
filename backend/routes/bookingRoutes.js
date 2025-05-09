const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const AdminHotel = require('../models/AdminHotel'); // Use AdminHotel instead of Hotel
const Booking = require('../models/Booking');
const User = require('../models/User');

// Load environment variables
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('JWT_SECRET is not defined in .env file');
  process.exit(1);
}

// Middleware to verify user token
const verifyUser = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided in Authorization header' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('Token decoded:', decoded);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    req.userId = decoded.id;
    req.user = user;
    next();
  } catch (error) {
    console.error('User token verification error:', error.stack);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Verify token endpoint
router.get('/verify-token', verifyUser, async (req, res) => {
  try {
    res.status(200).json({ user: req.user });
  } catch (error) {
    console.error('Verify token error:', error.stack);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a hotel booking
router.post(
  '/book',
  verifyUser,
  [
    body('hotelId').notEmpty().withMessage('Hotel ID is required'),
    body('roomIndex').isInt({ min: 0 }).withMessage('Room index must be a non-negative integer'),
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phoneNumber').notEmpty().withMessage('Phone number is required'),
    body('checkInDate').notEmpty().withMessage('Check-in date is required'),
    body('checkOutDate').notEmpty().withMessage('Check-out date is required'),
    body('totalPrice').isFloat({ min: 0 }).withMessage('Total price must be a positive number'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('Validation errors:', errors.array());
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    const {
      hotelId,
      roomIndex,
      firstName,
      lastName,
      email,
      phoneNumber,
      checkInDate,
      checkOutDate,
      specialRequests,
      totalPrice,
    } = req.body;

    console.log('Booking request:', {
      hotelId,
      roomIndex,
      firstName,
      lastName,
      email,
      phoneNumber,
      checkInDate,
      checkOutDate,
      totalPrice,
      specialRequests,
    });

    try {
      // Log database and collection details
      console.log(`Hotel query - Database: ${AdminHotel.db.name}, Collection: ${AdminHotel.collection.name}`);
      console.log(`Attempting to find hotel with _id: ${hotelId}`);
      const hotel = await AdminHotel.findById(hotelId);
      if (!hotel) {
        console.log(`Hotel not found for _id: ${hotelId}`);
        return res.status(404).json({ message: 'Hotel not found' });
      }
      console.log(`Hotel found: ${hotel.name}`);

      // Validate room index
      if (!hotel.rooms || roomIndex >= hotel.rooms.length) {
        console.log(`Invalid room index: ${roomIndex}, rooms length: ${hotel.rooms?.length || 0}`);
        return res.status(400).json({ message: 'Invalid room index' });
      }

      const room = hotel.rooms[roomIndex];
      if (!room.type || !room.price) {
        console.log(`Room missing type or price: ${JSON.stringify(room)}`);
        return res.status(400).json({ message: 'Room type or price is missing' });
      }

      // Validate dates
      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkOutDate);
      if (checkOut <= checkIn) {
        console.log(`Invalid dates: checkIn=${checkInDate}, checkOut=${checkOutDate}`);
        return res.status(400).json({ message: 'Check-out date must be after check-in date' });
      }

      // Calculate nights and verify total price
      const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
      const calculatedPrice = room.price * nights;
      if (Math.abs(calculatedPrice - totalPrice) > 0.01) {
        console.log(`Total price mismatch: calculated=${calculatedPrice}, provided=${totalPrice}`);
        return res.status(400).json({ message: 'Total price mismatch' });
      }

      // Create new booking
      console.log(`Saving booking to collection: ${Booking.collection.name}`);
      const newBooking = new Booking({
        hotelId,
        roomType: room.type,
        userId: req.userId,
        firstName,
        lastName,
        email,
        phoneNumber,
        checkInDate,
        checkOutDate,
        specialRequests: specialRequests || '',
        totalPrice,
        status: 'pending',
        paymentStatus: 'holding',
      });

      await newBooking.save();
      console.log(`Booking saved: _id=${newBooking._id}`);

      res.status(201).json({
        message: 'Hotel booking successful!',
        booking: { _id: newBooking._id, totalPrice },
      });
    } catch (error) {
      console.error('Booking error:', error.stack);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

module.exports = router;