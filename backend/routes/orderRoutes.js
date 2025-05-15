const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByUserName,
  getOrdersByUserId, // import new controller
} = require('../controllers/orderController');

// Place a new order
router.post('/place-order', placeOrder);

// Get all orders
router.get('/', getAllOrders);

// Get orders by username
router.get('/user/:username', getOrdersByUserName);

// Get orders by userId
router.get('/userid/:userId', getOrdersByUserId); // new endpoint

// Get a single order by ID
router.get('/:id', getOrderById);

// Update order status
router.patch('/:id/status', updateOrderStatus);

module.exports = router;