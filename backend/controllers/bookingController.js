const Booking = require('../models/Booking');

const bookingHotel = async (req, res) => {
    try {
        console.log('Received Data:', req.body);

        const {
            hotelId,
            userId,
            Email,
            bookingStartDate,
            bookingEndDate,
            bookingPrice,
            PhoneNumber,
            specialRequests,
            Arrived,
        } = req.body;

        if (!hotelId || !userId || !Email || !bookingStartDate || !bookingEndDate || !bookingPrice || !PhoneNumber) {
            return res.status(400).json({ message: 'All required fields must be filled' });
        }

        const newBooking = new Booking({
            hotelId,
            userId,
            Email,
            bookingStartDate,
            bookingEndDate,
            bookingPrice,
            PhoneNumber,
            specialRequests,
            Arrived,
        });

        await newBooking.save();
        res.status(201).json({ message: 'Booking successful', booking: newBooking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again later' });
    }
};

module.exports = { bookingHotel };