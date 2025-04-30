import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MessageModal from "../components/MessageModal";

const BookingPage = () => {
  const { id, roomType } = useParams();
  const navigate = useNavigate();

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, message: "", type: "" });
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await fetch(`/api/hotels/${id}`);
        if (!response.ok) {
          throw new Error(`Hotel not found (status: ${response.status})`);
        }
        const data = await response.json();
        setHotel(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  if (loading) {
    return <h2 className="text-center text-gray-600 text-2xl font-semibold py-10">Loading...</h2>;
  }

  if (error || !hotel) {
    return <h2 className="text-center text-red-600 text-2xl font-semibold py-10">{error || "Hotel Not Found"}</h2>;
  }

  const roomIndex = parseInt(roomType.replace("room", ""), 10);
  const room = hotel.rooms[roomIndex];

  if (!room) {
    return <h2 className="text-center text-red-600 text-2xl font-semibold py-10">Room Not Found</h2>;
  }

  const roomName = room.type || "Unnamed Room";
  const roomPrice = room.price || 0;

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut - checkIn;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const nights = calculateNights();
  const totalPrice = nights * roomPrice;

  const handleBooking = async (event) => {
    event.preventDefault();
    const bookingData = {
      hotelId: id,
      userId: localStorage.getItem('userId') || 'guest',
      roomType: roomName,
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      email: event.target.email.value,
      phoneNumber: event.target.phoneNumber.value,
      checkInDate,
      checkOutDate,
      specialRequests: event.target.specialRequests.value,
    };

    try {
      const response = await fetch("/api/bookings/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });
      const data = await response.json();

      if (response.ok) {
        setModal({
          isOpen: true,
          message: "Booking Successful! Proceeding to payment.",
          type: "success",
        });
        setTimeout(() => navigate("/hotels/payment", { state: { bookingData, amount: totalPrice } }), 2000);
      } else {
        setModal({
          isOpen: true,
          message: data.message || "Error processing booking",
          type: "error",
        });
      }
    } catch (error) {
      setModal({
        isOpen: true,
        message: `Network error: ${error.message}`,
        type: "error",
      });
    }
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-6">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Book Your Stay</h1>
          <button
            onClick={() => navigate(`/hotels/${id}`)}
            className="text-blue-600 hover:underline font-semibold"
          >
            ← Back to Hotel Details
          </button>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Booking Summary</h2>
          <p className="text-gray-700 mt-2">
            <strong>Hotel:</strong> {hotel.name}
          </p>
          <p className="text-gray-700">
            <strong>Location:</strong> {hotel.location}
          </p>
          <p className="text-gray-700">
            <strong>Room Type:</strong> {roomName}
          </p>
          <p className="text-gray-700">
            <strong>Price per Night:</strong> ${roomPrice}
          </p>
        </div>

        {/* Booking Form */}
        <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              placeholder="Enter your first name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              placeholder="Enter your last name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="phoneNumber" className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Enter your phone number"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="checkInDate" className="block text-gray-700 font-medium mb-1">
              Check-In Date
            </label>
            <input
              type="date"
              id="checkInDate"
              name="checkInDate"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="checkOutDate" className="block text-gray-700 font-medium mb-1">
              Check-Out Date
            </label>
            <input
              type="date"
              id="checkOutDate"
              name="checkOutDate"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="specialRequests" className="block text-gray-700 font-medium mb-1">
              Special Requests
            </label>
            <textarea
              id="specialRequests"
              name="specialRequests"
              placeholder="Any special requests?"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition min-h-[100px]"
            />
          </div>

          {/* Pricing Summary */}
          <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg mt-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pricing Details</h3>
            <p className="text-gray-700">
              <strong>Nightly Rate:</strong> ${roomPrice}
            </p>
            <p className="text-gray-700">
              <strong>Number of Nights:</strong> {nights || "Select dates to calculate"}
            </p>
            <p className="text-gray-700 font-semibold">
              <strong>Total Price:</strong> ${totalPrice || "0"}
            </p>
            <p className="text-gray-400">
              You can cancel your reservation free of charge up to 7 days before check-in for a full refund.
              Cancellations made within 7 days of arrival may incur a fee (varies by rate type).
              No-shows or early departures are non-refundable.
            </p>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition font-semibold shadow-md"
              disabled={!nights}
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>
      {modal.isOpen && <MessageModal message={modal.message} type={modal.type} onClose={closeModal} />}
    </div>
  );
};

export default BookingPage;