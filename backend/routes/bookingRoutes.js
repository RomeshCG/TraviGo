const express = require('express');
const Booking = require('../models/Booking');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const bookings = await Booking.find();
        res.status(200).json(bookings);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        console.log(`PATCH request received for ID: ${req.params.id}, body:`, req.body);
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!booking) {
            console.log(`Booking not found for ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Booking not found' });
        }
        console.log('Booking updated:', booking);
        res.status(200).json(booking);
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ message: 'Error updating booking' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        console.log(`DELETE request received for ID: ${req.params.id}`);
        const booking = await Booking.findByIdAndDelete(req.params.id);
        if (!booking) {
            console.log(`Booking not found for ID: ${req.params.id}`);
            return res.status(404).json({ message: 'Booking not found' });
        }
        console.log('Booking deleted:', booking);
        res.status(200).json({ message: 'Booking deleted' });
    } catch (error) {
        console.error('Error deleting booking:', error);
        res.status(500).json({ message: 'Error deleting booking' });
    }
});

router.post('/book', async (req, res) => {
    try {
        console.log('Incoming booking request:', req.body);
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(200).json({ message: 'Booking successful!' });
    } catch (error) {
        console.error('Error saving booking:', error);
        res.status(500).json({ message: 'Error processing booking' });
    }
});

module.exports = router;