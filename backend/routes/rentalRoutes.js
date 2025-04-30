const express = require('express');
const RentalRequest = require('../models/RentalRequest');

const router = express.Router();

// Get all rental requests
router.get('/rent', async (req, res) => {
  try {
    const rentals = await RentalRequest.find();
    res.status(200).json({
      success: true,
      data: rentals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch rentals: ' + error.message,
    });
  }
});

// Create a new rental request
router.post('/rent', async (req, res) => {
  try {
    const rentalData = { ...req.body, status: 'Pending' };
    const rentalRequest = new RentalRequest(rentalData);
    const savedRental = await rentalRequest.save();
    res.status(201).json({
      success: true,
      data: savedRental,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to save rental: ' + error.message,
    });
  }
});

// Update rental request status
router.put('/rent/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const rental = await RentalRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!rental) {
      return res.status(404).json({
        success: false,
        error: 'Rental not found',
      });
    }
    res.status(200).json({
      success: true,
      data: rental,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to update rental: ' + error.message,
    });
  }
});

// Delete rental request
router.delete('/rent/:id', async (req, res) => {
  try {
    const rental = await RentalRequest.findByIdAndDelete(req.params.id);
    if (!rental) {
      return res.status(404).json({
        success: false,
        error: 'Rental not found',
      });
    }
    res.status(200).json({
      success: true,
      message: 'Rental deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to delete rental: ' + error.message,
    });
  }
});

module.exports = router;