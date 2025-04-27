import express from 'express';
import RentalRequest from '../models/RentalRequest.js';

const router = express.Router();

router.post('/rent', async (req, res) => {
    try {
        const rentalData = req.body;
        const rentalRequest = new RentalRequest(rentalData);
        await rentalRequest.save();
        res.status(201).json({
            success: true,
            data: rentalRequest
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;