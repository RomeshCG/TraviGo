const jwt = require('jsonwebtoken');
const ServiceProvider = require('../models/ServiceProvider');

const auth = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const provider = await ServiceProvider.findById(decoded.id);
    if (!provider) {
      return res.status(404).json({ message: 'Service provider not found' });
    }
    // Set req.user to match vehicleRoutes.js expectations
    req.user = {
      _id: provider._id,
      email: provider.email,
      providerType: provider.providerType,
      name: provider.name,
    };
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.stack);
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired, please log in again' });
    }
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = auth;