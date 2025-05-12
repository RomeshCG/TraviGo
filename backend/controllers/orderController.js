const Order = require('../models/Order');
const RentingVehicle = require('../models/RentingVehicle');

// Place a new order
const placeOrder = async (req, res) => {
  const { vehicleId, userName, startDate, endDate, totalPrice, paymentMethod } = req.body;

  try {
    const order = new Order({
      vehicleId,
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
    const orders = await Order.find().populate('vehicleId'); // Ensure 'vehicleId' references RentingVehicle
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
};