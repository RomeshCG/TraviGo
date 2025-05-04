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
  const [email, setEmail] = useState("");
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

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

  const handleSendVerificationCode = () => {
    if (!email) {
      setModal({ isOpen: true, message: "Please enter a valid email address.", type: "error" });
      return;
    }
    // Mock email sending: Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    localStorage.setItem('verificationCode_' + email, code); // Store code locally
    localStorage.setItem('codeExpiry_' + email, Date.now() + 15 * 60 * 1000); // Expires in 15 minutes
    setIsVerifyingEmail(true);
    setModal({
      isOpen: true,
      message: `A verification code has been sent to ${email}. Code (for demo): ${code}`,
      type: "success",
    });
  };

  const handleVerifyCode = () => {
    const storedCode = localStorage.getItem('verificationCode_' + email);
    const expiry = localStorage.getItem('codeExpiry_' + email);
    if (expiry && Date.now() > expiry) {
      localStorage.removeItem('verificationCode_' + email);
      localStorage.removeItem('codeExpiry_' + email);
      setModal({ isOpen: true, message: "Verification code has expired.", type: "error" });
      return;
    }
    if (verificationCode === storedCode) {
      setEmailVerified(true);
      setIsVerifyingEmail(false);
      setModal({ isOpen: true, message: "Email verified successfully!", type: "success" });
    } else {
      setModal({ isOpen: true, message: "Invalid verification code.", type: "error" });
    }
  };

  const handleBooking = async (event) => {
    event.preventDefault();
    if (!emailVerified) {
      setModal({ isOpen: true, message: "Please verify your email before booking.", type: "error" });
      return;
    }

    const bookingData = {
      hotelId: id,
      userId: localStorage.getItem('userId') || 'guest',
      roomType: hotel.rooms[parseInt(roomType.replace("room", ""), 10)]?.type || "Unnamed Room",
      firstName: event.target.firstName.value,
      lastName: event.target.lastName.value,
      email: email,
      phoneNumber: event.target.phoneNumber.value,
      checkInDate,
      checkOutDate,
      specialRequests: event.target.specialRequests.value,
      bookingPrice: calculateNights() * (hotel.rooms[parseInt(roomType.replace("room", ""), 10)]?.price || 0),
      emailVerified: true, // Include verification status
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
        setTimeout(() => navigate("/hotels/payment", { state: { bookingData, amount: bookingData.bookingPrice } }), 2000);
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

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut - checkIn;
    const nights = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  if (loading) {
    return <h2 className="text-center text-gray-600 text-2xl font-semibold py-10">Loading...</h2>;
  }

  if (error || !hotel) {
    return <h2 className="text-center text-red-600 text-2xl font-semibold py-10">{error || "Hotel Not Found"}</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg p-8">
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
        <div className="bg-gray-50 p-6 rounded-lg mb-6 shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Summary</h2>
          <p className="text-gray-700 mb-2">
            <strong>Hotel:</strong> {hotel.name}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Location:</strong> {hotel.location}
          </p>
          <p className="text-gray-700 mb-2">
            <strong>Room Type:</strong> {hotel.rooms[parseInt(roomType.replace("room", ""), 10)]?.type || "Unnamed Room"}
          </p>
          <p className="text-gray-700">
            <strong>Price per Night:</strong> ${hotel.rooms[parseInt(roomType.replace("room", ""), 10)]?.price || 0}
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
            <div className="flex items-center space-x-4">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
                disabled={emailVerified}
              />
              {!emailVerified && !isVerifyingEmail && (
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                  Verify Email
                </button>
              )}
            </div>
            {isVerifyingEmail && (
              <div className="mt-4">
                <label htmlFor="verificationCode" className="block text-gray-700 font-medium mb-1">
                  Verification Code
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    id="verificationCode"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter the 6-digit code"
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={handleVerifyCode}
                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition"
                  >
                    Submit Code
                  </button>
                </div>
              </div>
            )}
            {emailVerified && (
              <p className="text-green-600 mt-2">Email Verified ✓</p>
            )}
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
          <div className="md:col-span-2 bg-gray-50 p-6 rounded-lg mt-4 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Pricing Details</h3>
            <p className="text-gray-700 mb-2">
              <strong>Nightly Rate:</strong> ${hotel.rooms[parseInt(roomType.replace("room", ""), 10)]?.price || 0}
            </p>
            <p className="text-gray-700 mb-2">
              <strong>Number of Nights:</strong> {calculateNights() || "Select dates to calculate"}
            </p>
            <p className="text-gray-700 font-semibold mb-2">
              <strong>Total Price:</strong> ${calculateNights() * (hotel.rooms[parseInt(roomType.replace("room", ""), 10)]?.price || 0) || "0"}
            </p>
            <p className="text-gray-500 text-sm">
              You can cancel your reservation free of charge up to 7 days before check-in for a full refund.
              Cancellations made within 7 days of arrival may incur a fee (varies by rate type).
              No-shows or early departures are non-refundable.
            </p>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!calculateNights() || !emailVerified}
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