const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend URL
  credentials: true,
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
const connectDB = require('./config/db');
connectDB();

// Routes
app.use('/api', require('./routes/api'));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});