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
// const paymentRoutes = require('./routes/paymentRoutes'); // Remove this line
const emailRoutes = require('./routes/emailRoutes');
const tourGuideBookingRoutes = require('./routes/tourGuideBookingRoutes');
const rentingVehicleRoutes = require('./routes/rentingVehicleRoutes');
const orderRoutes = require('./routes/orderRoutes');
const vehicleReviewRoutes = require('./routes/vehicleReviewRoutes'); // Added vehicle review routes
const hotelPaymentRoutes = require('./routes/hotelPaymentRoutes');
const vehicleOrderReviewRoutes = require('./routes/vehicleOrderReviewRoutes'); // Vehicle order review routes

app.use('/api', adminRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/hotels', hotelRoutes);
// app.use('/api/payments', paymentRoutes); // Remove this line
app.use('/api/emails', emailRoutes);
app.use('/api/tour-guides', tourGuideBookingRoutes);
app.use('/api/renting-vehicles', rentingVehicleRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', vehicleReviewRoutes); // Added vehicle review routes
app.use('/api/hotel-payments', hotelPaymentRoutes);
app.use('/api/vehicle-order-reviews', vehicleOrderReviewRoutes); // Vehicle order review endpoints

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});