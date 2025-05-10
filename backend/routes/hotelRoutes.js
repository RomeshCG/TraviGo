const express = require('express');
const cloudinary = require('cloudinary').v2;
const AdminHotel = require('../models/AdminHotel');
const verifyToken = require('../middleware/verifyToken');
require('dotenv').config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware to verify provider token
const verifyProvider = verifyToken('HotelProvider');

// Add a new hotel
router.post('/add', verifyProvider, async (req, res) => {
  try {
    const { name, location, price, description, image, imageArray, rooms } = req.body;
    const providerId = req.providerId; // Use req.providerId instead of req.provider._id

    if (!name || !location || !price || !description || !image) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const mainImageResult = await cloudinary.uploader.upload(image, {
      folder: 'admin_hotels',
    });

    const uploadedImageArray = imageArray.length
      ? await Promise.all(
          imageArray.map((img) => cloudinary.uploader.upload(img, { folder: 'admin_hotels' }))
        )
      : [];

    const uploadedRooms = await Promise.all(
      rooms.map(async (room) => {
        const roomImages = room.images.length
          ? await Promise.all(
              room.images.map((img) => cloudinary.uploader.upload(img, { folder: 'admin_hotels/rooms' }))
            )
          : [];
        return {
          ...room,
          images: roomImages.map((img) => img.secure_url),
        };
      })
    );

    const hotel = new AdminHotel({
      providerId,
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

// Get all hotels (for public-facing pages)
router.get('/', async (req, res) => {
  try {
    const hotels = await AdminHotel.find();
    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching hotels:', error);
    res.status(500).json({ message: 'Failed to fetch hotels', error: error.message });
  }
});

// Get hotels for a specific provider (for dashboard)
router.get('/provider', verifyProvider, async (req, res) => {
  try {
    const providerId = req.providerId; // Use req.providerId instead of req.provider._id
    const hotels = await AdminHotel.find({ providerId });
    res.status(200).json(hotels);
  } catch (error) {
    console.error('Error fetching provider hotels:', error);
    res.status(500).json({ message: 'Failed to fetch hotels', error: error.message });
  }
});

// Get a specific hotel by ID
router.get('/:id', async (req, res) => {
  try {
    const hotel = await AdminHotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    res.status(200).json(hotel);
  } catch (error) {
    console.error('Error fetching hotel:', error);
    res.status(500).json({ message: 'Failed to fetch hotel', error: error.message });
  }
});

// Update a hotel
router.put('/:id', verifyProvider, async (req, res) => {
  try {
    const { name, location, price, description, phone, email, image, imageArray, rooms } = req.body;
    const providerId = req.providerId; // Use req.providerId instead of req.provider._id

    const hotel = await AdminHotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ message: 'Hotel not found' });
    if (hotel.providerId.toString() !== providerId) {
      return res.status(403).json({ message: 'Unauthorized: You can only update your own hotels' });
    }

    const updateData = {
      name,
      location,
      price: Number(price),
      description,
      phone,
      email,
      rooms,
    };

    if (image && image !== hotel.image) {
      const mainImageResult = await cloudinary.uploader.upload(image, { folder: 'admin_hotels' });
      updateData.image = mainImageResult.secure_url;
    }

    if (imageArray && imageArray.length) {
      const uploadedImageArray = await Promise.all(
        imageArray.map((img) => cloudinary.uploader.upload(img, { folder: 'admin_hotels' }))
      );
      updateData.imageArray = uploadedImageArray.map((img) => img.secure_url);
    }

    if (rooms) {
      updateData.rooms = await Promise.all(
        rooms.map(async (room) => {
          const roomImages = room.images.length
            ? await Promise.all(
                room.images.map((img) =>
                  typeof img === 'string' ? img : cloudinary.uploader.upload(img, { folder: 'admin_hotels/rooms' }).then((res) => res.secure_url)
                )
              )
            : [];
          return { ...room, images: roomImages };
        })
      );
    }

    const updatedHotel = await AdminHotel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ message: 'Hotel updated successfully', hotel: updatedHotel });
  } catch (error) {
    console.error('Error updating hotel:', error);
    res.status(500).json({ message: 'Failed to update hotel', error: error.message });
  }
});

module.exports = router;