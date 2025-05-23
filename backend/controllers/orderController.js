const Order = require('../models/Order');
const RentingVehicle = require('../models/RentingVehicle');

// Place a new order
const placeOrder = async (req, res) => {
  const { vehicleId, userId, userName, startDate, endDate, totalPrice, paymentMethod } = req.body;

  try {
    const order = new Order({
      vehicleId,
      userId, // Save userId
      userName,
      startDate,
      endDate,
      totalPrice,
      paymentMethod,
    });
    await order.save();
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to place order', error: err.message });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('vehicleId').populate('userId'); // Populate userId for contact info
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders', error: err.message });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id).populate('vehicleId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order', error: err.message });
  }
};

// Get orders by userName
const getOrdersByUserName = async (req, res) => {
  const { username } = req.params;
  console.log('[getOrdersByUserName] username param:', username); // Debug log
  try {
    const orders = await Order.find({ userName: username }).populate('vehicleId');
    console.log(`[getOrdersByUserName] Found ${orders.length} orders for userName:`, username); // Debug log
    res.status(200).json(orders);
  } catch (err) {
    console.error('[getOrdersByUserName] Error:', err); // Debug log
    res.status(500).json({ message: 'Failed to fetch user orders', error: err.message });
  }
};

// Get orders by userId
const getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const orders = await Order.find({ userId }).populate('vehicleId').populate('userId'); // Populate userId for contact info
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user orders', error: err.message });
  }
};

// Update order status
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(id).populate('vehicleId');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update the order status
    order.status = status;
    await order.save();

    // If the order is accepted, update the vehicle's availability
    if (status === 'Confirmed') {
      const vehicle = await RentingVehicle.findById(order.vehicleId._id);
      if (vehicle) {
        vehicle.availability.push({
          startDate: order.startDate,
          endDate: order.endDate,
        });
        await vehicle.save();
      }
    }

    res.status(200).json({ message: 'Order status updated successfully', order });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
};

module.exports = {
  placeOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  getOrdersByUserName,
  getOrdersByUserId, // Export new controller
};