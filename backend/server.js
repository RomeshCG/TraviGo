const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

//mongoDB Connection
const  connectDB = require('./config/db');
connectDB();

//Routes
app.use('/api', require('./routes/api'));

app.listen(port, ()=>{
    console.log(`Server running on Port ${port}`);
});