const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/orderController');

// Place a new order
router.post('/place-order', placeOrder);

// Get all orders
router.get('/', getAllOrders);

// Get a single order by ID
router.get('/:id', getOrderById);

// Update order status
router.patch('/:id/status', updateOrderStatus);

module.exports = router;