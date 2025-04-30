const express = require('express');
const cloudinary = require('cloudinary').v2;
const Hotel = require('../models/Hotel');
require('dotenv').config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

router.post('/add', async (req, res) => {
    try {
        const { name, location, price, description, image, imageArray, rooms } = req.body;

        console.log('Received data:', { name, location, price, description });
        console.log('Image:', image ? 'Provided' : 'Missing');
        console.log('ImageArray length:', imageArray ? imageArray.length : 0);
        console.log('Rooms:', rooms);

        if (!name || !location || !price || !description || !image) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const mainImageResult = await cloudinary.uploader.upload(image, {
            folder: 'hotels',
        });
        console.log('Main image uploaded:', mainImageResult.secure_url);

        const uploadedImageArray = imageArray.length
            ? await Promise.all(
                  imageArray.map((img) => cloudinary.uploader.upload(img, { folder: 'hotels' }))
              )
            : [];
        console.log('Additional images uploaded:', uploadedImageArray.map((img) => img.secure_url));

        const uploadedRooms = await Promise.all(
            rooms.map(async (room) => {
                const roomImages = room.images.length
                    ? await Promise.all(
                          room.images.map((img) => cloudinary.uploader.upload(img, { folder: 'hotels/rooms' }))
                      )
                    : [];
                return {
                    ...room,
                    images: roomImages.map((img) => img.secure_url),
                };
            })
        );
        console.log('Room images uploaded:', uploadedRooms);

        const hotel = new Hotel({
            name,
            location,
            image: mainImageResult.secure_url,
            imageArray: uploadedImageArray.map((img) => img.secure_url),
            price: Number(price),
            description,
            rooms: uploadedRooms,
        });

        await hotel.save();
        res.status(201).json({ message: 'Hotel added successfully', hotel });
    } catch (error) {
        console.error('Error adding hotel:', error);
        res.status(500).json({ message: 'Failed to add hotel', error: error.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const hotels = await Hotel.find();
        res.status(200).json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ message: 'Failed to fetch hotels', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
        res.status(200).json(hotel);
    } catch (error) {
        console.error('Error fetching hotel:', error);
        res.status(500).json({ message: 'Failed to fetch hotel', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const { name, location, phone, email } = req.body;
        console.log('Update request received:', { name, location, phone, email });

        const updatedHotel = await Hotel.findByIdAndUpdate(
            req.params.id,
            { name, location, phone, email },
            { new: true, runValidators: true }
        );

        if (!updatedHotel) {
            return res.status(404).json({ message: 'Hotel not found' });
        }

        console.log('Hotel updated:', updatedHotel);
        res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });
    } catch (error) {
        console.error('Error updating hotel:', error);
        res.status(500).json({ message: 'Failed to update hotel', error: error.message });
    }
});

module.exports = router;