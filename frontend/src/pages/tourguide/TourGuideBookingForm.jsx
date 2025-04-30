import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const TourGuideBookingForm = () => {
  const { guideId, packageId } = useParams(); // Get guideId and packageId from URL
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    country: "",
    travelersCount: 1,
    travelDate: "",
  });
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    console.log("Fetching package price for packageId:", packageId); // Debugging
    const fetchPackagePrice = async () => {
      try {
        const response = await fetch(`/api/tour-packages/${packageId}`);
        const data = await response.json();
        if (response.ok) {
          const price = data.price;
          setTotalPrice(price * formData.travelersCount);
        } else {
          console.error("Failed to fetch package price:", data.message);
        }
      } catch (error) {
        console.error("Error fetching package price:", error);
      }
    };

    fetchPackagePrice();
  }, [packageId, formData.travelersCount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/tour-guide/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ ...formData, guideId, packageId }),
      });

      const responseData = await response.json();

      if (response.ok) {
        console.log("Booking successful:", responseData);
        navigate("/tour-guide/payment", {
          state: {
            bookingId: responseData.booking._id,
            totalPrice: responseData.booking.totalPrice,
          },
        });
      } else {
        console.error("Booking failed:", responseData);
        alert(responseData.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting booking:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Book Your Tour</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Number of Travelers</label>
          <input
            type="number"
            name="travelersCount"
            value={formData.travelersCount}
            onChange={handleChange}
            min="1"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Travel Date</label>
          <input
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <p className="text-gray-700 font-bold">Total Price: ${totalPrice.toFixed(2)}</p>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Proceed to Payment
        </button>
      </form>
    </div>
  );
};

export default TourGuideBookingForm;