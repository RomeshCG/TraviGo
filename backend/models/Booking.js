const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotelBookingSchema = new Schema({
  hotelId: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
  roomType: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  checkInDate: { type: Date, required: true },
  checkOutDate: { type: Date, required: true },
  specialRequests: { type: String },
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  paymentStatus: { type: String, default: 'holding' },
  createdAt: { type: Date, default: Date.now }
}, { collection: 'hotel_bookings' });

module.exports = mongoose.model('Booking', hotelBookingSchema);