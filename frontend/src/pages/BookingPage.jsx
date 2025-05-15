import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ConfirmationModal from "../components/ConfirmationModal";
import MessageModal from "../components/MessageModal";

const BookingPage = () => {
  const { id, roomType } = useParams();
  const navigate = useNavigate();
  const roomIndex = parseInt(roomType.replace("room", ""), 10);

  const [accommodation, setAccommodation] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, message: "", type: "" });
  const [confirmationModal, setConfirmationModal] = useState({ isOpen: false, bookingData: null });
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    checkInDate: "",
    checkOutDate: "",
    specialRequests: "",
  });

  useEffect(() => {
    console.log(`BookingPage loaded with hotelId: ${id}, roomIndex: ${roomIndex}`);
    const fetchData = async () => {
      try {
        // Fetch accommodation
        const accommodationResponse = await fetch(`http://localhost:5000/api/hotels/${id}`);
        if (!accommodationResponse.ok) {
          throw new Error(`Accommodation not found (status: ${accommodationResponse.status})`);
        }
        const accommodationData = await accommodationResponse.json();
        setAccommodation(accommodationData);

        // Fetch user data
        const token = localStorage.getItem("token");
        if (token) {
          const userResponse = await fetch("http://localhost:5000/api/bookings/verify-token", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (userResponse.ok) {
            const userData = await userResponse.json();
            setUser(userData.user);
            setFormData((prev) => ({
              ...prev,
              firstName: userData.user.username.split(" ")[0] || "",
              lastName: userData.user.username.split(" ")[1] || "",
              email: userData.user.email || "",
              phoneNumber: userData.user.phoneNumber || "",
            }));
          } else {
            throw new Error("Invalid token");
          }
        } else {
          throw new Error("No token found");
        }
      } catch (err) {
        setError(err.message);
        setModal({
          isOpen: true,
          message: err.message === "No token found" ? "Please log in to continue." : err.message,
          type: "error",
        });
        if (err.message === "No token found" || err.message === "Invalid token") {
          setTimeout(() => navigate("/login"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const calculateNights = () => {
    if (!formData.checkInDate || !formData.checkOutDate) return 0;
    const checkIn = new Date(formData.checkInDate);
    const checkOut = new Date(formData.checkOutDate);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    const roomPrice = accommodation?.rooms[roomIndex]?.price || 0;
    return nights * roomPrice;
  };

  const handleBooking = (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setModal({
        isOpen: true,
        message: "You must be logged in to book an accommodation.",
        type: "error",
      });
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const { firstName, lastName, email, phoneNumber, checkInDate, checkOutDate } = formData;
    if (!firstName || !lastName || !email || !phoneNumber || !checkInDate || !checkOutDate) {
      setModal({
        isOpen: true,
        message: "Please fill all required fields.",
        type: "error",
      });
      return;
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const nights = calculateNights();
    if (nights <= 0) {
      setModal({
        isOpen: true,
        message: "Check-out date must be after check-in date.",
        type: "error",
      });
      return;
    }

    const bookingData = {
      hotelId: id,
      roomIndex,
      firstName,
      lastName,
      email,
      phoneNumber,
      checkInDate,
      checkOutDate,
      specialRequests: formData.specialRequests || "",
      totalPrice: calculateTotalPrice(),
      nights,
      roomType: accommodation?.rooms[roomIndex]?.type || "Unnamed Room",
    };

    console.log("Submitting booking:", bookingData);

    setConfirmationModal({ isOpen: true, bookingData });
  };

  const confirmBooking = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/bookings/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(confirmationModal.bookingData),
      });
      const data = await response.json();

      if (response.ok) {
        setModal({
          isOpen: true,
          message: "Booking saved! Proceeding to payment.",
          type: "success",
        });
        setConfirmationModal({ isOpen: false, bookingData: null });
        setTimeout(() => {
          navigate("/hotels/payment", {
            state: {
              bookingData: confirmationModal.bookingData,
              amount: confirmationModal.bookingData.totalPrice,
              bookingId: data.booking._id,
            },
          });
        }, 2000);
      } else {
        if (response.status === 404 && data.message === "Hotel not found") {
          setModal({
            isOpen: true,
            message: "The selected hotel is no longer available. Redirecting to hotels list.",
            type: "error",
          });
          setConfirmationModal({ isOpen: false, bookingData: null });
          setTimeout(() => navigate("/hotels"), 2000);
          return;
        }
        let errorMessage = data.message || "Booking failed.";
        if (data.errors) {
          errorMessage += " " + data.errors.map((err) => err.msg).join(", ");
        }
        setModal({
          isOpen: true,
          message: errorMessage,
          type: "error",
        });
        setConfirmationModal({ isOpen: false, bookingData: null });
        if (response.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setTimeout(() => navigate("/login"), 2000);
        }
      }
    } catch (error) {
      setModal({
        isOpen: true,
        message: `Network error: ${error.message}. Please try again later.`,
        type: "error",
      });
      setConfirmationModal({ isOpen: false, bookingData: null });
    }
  };

  const closeModal = () => setModal({ ...modal, isOpen: false });

  if (loading) {
    return <div className="text-center text-gray-600 text-2xl font-semibold py-10">Loading...</div>;
  }

  if (error || !accommodation) {
    return <div className="text-center text-red-600 text-2xl font-semibold py-10">{error || "Accommodation Not Found"}</div>;
  }

  console.log("Rendering BookingPage");
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Book Your Stay</h1>
          <button
            onClick={() => navigate(`/hotels/${id}`)}
            className="text-blue-600 hover:underline font-semibold flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Details
          </button>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg mb-8 shadow-sm">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Booking Summary</h2>
          <div className="space-y-2">
            <p className="text-gray-700"><strong>Name:</strong> {accommodation.name}</p>
            <p className="text-gray-700"><strong>Location:</strong> {accommodation.location}</p>
            <p className="text-gray-700"><strong>Room Type:</strong> {accommodation.rooms[roomIndex]?.type || "Unnamed Room"}</p>
            <p className="text-gray-700"><strong>Price per Night:</strong> ${accommodation.rooms[roomIndex]?.price || 0}</p>
            <p className="text-gray-700"><strong>Nights:</strong> {calculateNights()}</p>
            <p className="text-gray-700 font-semibold"><strong>Total Price:</strong> ${calculateTotalPrice().toFixed(2)}</p>
          </div>
        </div>

        <form onSubmit={handleBooking} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="Enter your first name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
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
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="Enter your last name"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
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
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
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
              value={formData.checkInDate}
              onChange={handleInputChange}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
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
              value={formData.checkOutDate}
              onChange={handleInputChange}
              min={formData.checkInDate || new Date().toISOString().split("T")[0]}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
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
              value={formData.specialRequests}
              onChange={handleInputChange}
              placeholder="Any special requests?"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition min-h-[120px]"
            />
          </div>
          <div className="md:col-span-2 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(`/hotels/${id}`)}
              className="bg-gray-300 text-gray-700 py-3 px-6 rounded-md hover:bg-gray-400 transition font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!calculateNights()}
            >
              Review Booking
            </button>
          </div>
        </form>
      </div>
      {modal.isOpen && <MessageModal message={modal.message} type={modal.type} onClose={closeModal} />}
      {confirmationModal.isOpen && (
        <ConfirmationModal
          bookingData={confirmationModal.bookingData}
          accommodation={accommodation}
          roomIndex={roomIndex}
          onConfirm={confirmBooking}
          onEdit={() => setConfirmationModal({ isOpen: false, bookingData: null })}
        />
      )}
    </div>
  );
};

export default BookingPage;