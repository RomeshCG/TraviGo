const jwt = require('jsonwebtoken');
const ServiceProvider = require('../models/ServiceProvider');

const verifyToken = (role) => async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ message: 'No token provided in Authorization header' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded.id) {
            return res.status(401).json({ message: 'Invalid token: Missing provider ID' });
        }

        const provider = await ServiceProvider.findById(decoded.id);
        if (!provider) {
            return res.status(404).json({ message: 'Service provider not found' });
        }

        if (provider.providerType !== role) {
            return res.status(403).json({ message: `Access denied: Requires ${role} role` });
        }

        req.providerId = decoded.id;
        next();
    } catch (error) {
        console.error('Token verification error:', error.stack);
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ message: 'Token expired, please log in again' });
        }
        return res.status(403).json({ message: 'Invalid token', error: error.message });
    }
};

module.exports = verifyToken;