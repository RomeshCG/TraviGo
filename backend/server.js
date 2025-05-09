const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const connectCloudinary = require('./config/cloudinary');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173'],
    credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const connectDB = require('./config/db');
connectDB();

// Connect to Cloudinary
connectCloudinary();

// Routes
const adminRoutes = require('./routes/api');
const bookingRoutes = require('./routes/bookingRoutes');
const hotelRoutes = require('./routes/hotelRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
<<<<<<< HEAD
=======
const emailRoutes = require('./routes/emailRoutes');
>>>>>>> cbfcd08e3fb8266a84fe0b73746e2d10d4c7040d
const tourGuideBookingRoutes = require('./routes/tourGuideBookingRoutes');

app.use('/api', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hotels', hotelRoutes);
app.use('/api/payments', paymentRoutes);
<<<<<<< HEAD
app.use('/api/rentals', rentalRoutes); // Adjusted for clarity
app.use('/api/vehicles', vehicleRoutes); // Adjusted for clarity
app.use('/api/tour-guides', tourGuideBookingRoutes); // Adjusted for clarity
=======
app.use('/api', rentalRoutes);
app.use('/api', vehicleRoutes);
app.use('/api', emailRoutes);
app.use('/api', tourGuideBookingRoutes);
>>>>>>> cbfcd08e3fb8266a84fe0b73746e2d10d4c7040d

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});