// bookVehicle.jsx
import React, { useState } from "react";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";


const vehicle = {
  name: "Toyota CHR 2018",
  pricePerDay: 12000,
  images: [
    "/assets/rearside.jpg", 
    "/assets/toyotaCHR.jpg",
    "/assets/chr.jpg",
    "/assets/CHRcar.jpg",
  ],
};

const BookVehicle = () => {
  // State for form inputs
  const [selectedImage, setSelectedImage] = useState(vehicle.images[0]);
  const [pickUpDate, setPickUpDate] = useState("");
  const [pickUpTime, setPickUpTime] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState({});

  const handlingFee = 1000;

  // Calculate trip cost based on the number of days
  const calculateTripCost = () => {
    if (!pickUpDate || !returnDate) return 0;
    const start = new Date(pickUpDate);
    const end = new Date(returnDate);
    const timeDiff = end - start;
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    return days > 0 ? days * vehicle.pricePerDay : 0;
  };

  const tripCost = calculateTripCost();
  const totalCost = tripCost + handlingFee;

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!pickUpDate) newErrors.pickUpDate = "Pick-up date is required";
    if (!pickUpTime) newErrors.pickUpTime = "Pick-up time is required";
    if (!returnDate) newErrors.returnDate = "Return date is required";
    if (!returnTime) newErrors.returnTime = "Return time is required";
    if (!location) newErrors.location = "Location is required";
    if (pickUpDate && returnDate) {
      const start = new Date(pickUpDate);
      const end = new Date(returnDate);
      if (end <= start) {
        newErrors.returnDate = "Return date must be after pick-up date";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Vehicle requested successfully!");
      // You can add API call or further logic here
    } else {
      alert("Please fill in all fields correctly.");
    }
  };

  return (
     
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">Travigo</h1>
        </div>
        <div className="flex space-x-2">
          <button className="bg-orange-500 text-white px-4 py-2 rounded">Login</button>
          <button 
          // eslint-disable-next-line no-undef
          onClick={() => navigate("/register")} className="bg-gray-200 text-black px-4 py-2 rounded">Register</button>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="text-gray-500 mb-4">
        Home &gt; Vehicles &gt; Toyota CHR
      </div>

      {/* Main Booking Section */}
      <div className="bg-white rounded-lg shadow-lg flex flex-col md:flex-row">
        {/* Left Section: Image Carousel */}
        <div className="w-full md:w-1/2 p-4">
          <img
            src={selectedImage}
            alt={`${vehicle.name} image`}
            className="w-full h-80 object-cover rounded-md"
          />
          <div className="flex space-x-2 mt-3">
            {vehicle.images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${vehicle.name} thumbnail ${index + 1}`}
                className={`w-20 h-16 object-cover rounded cursor-pointer ${
                  selectedImage === img ? "border-2 border-orange-500" : "border"
                }`}
                onClick={() => setSelectedImage(img)}
              />
            ))}
          </div>
        </div>

        {/* Right Section: Booking Form */}
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-2xl font-bold">{vehicle.name}</h2>
          <p className="text-xl text-orange-600 font-semibold">
            {vehicle.pricePerDay.toLocaleString()}.00 / Day
          </p>

          {/* Booking Inputs */}
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Pick Up</label>
              <div className="flex items-center border rounded p-2 bg-gray-50">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <input
                  type="date"
                  value={pickUpDate}
                  onChange={(e) => setPickUpDate(e.target.value)}
                  className="w-full outline-none bg-transparent"
                  aria-label="Pick-up Date"
                />
                <FaClock className="text-gray-500 ml-2" />
                <input
                  type="time"
                  value={pickUpTime}
                  onChange={(e) => setPickUpTime(e.target.value)}
                  className="w-full outline-none bg-transparent"
                  aria-label="Pick-up Time"
                />
              </div>
              {errors.pickUpDate && (
                <p className="text-red-500 text-sm">{errors.pickUpDate}</p>
              )}
              {errors.pickUpTime && (
                <p className="text-red-500 text-sm">{errors.pickUpTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Return</label>
              <div className="flex items-center border rounded p-2 bg-gray-50">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full outline-none bg-transparent"
                  aria-label="Return Date"
                />
                <FaClock className="text-gray-500 ml-2" />
                <input
                  type="time"
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="w-full outline-none bg-transparent"
                  aria-label="Return Time"
                />
              </div>
              {errors.returnDate && (
                <p className="text-red-500 text-sm">{errors.returnDate}</p>
              )}
              {errors.returnTime && (
                <p className="text-red-500 text-sm">{errors.returnTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Location</label>
              <div className="flex items-center border rounded p-2 bg-gray-50">
                <FaMapMarkerAlt className="text-gray-500 mr-2" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full outline-none bg-transparent"
                  placeholder="Location"
                  aria-label="Location"
                />
              </div>
              {errors.location && (
                <p className="text-red-500 text-sm">{errors.location}</p>
              )}
            </div>

            {/* Cost Breakdown */}
            <div className="bg-gray-50 p-4 mt-4 rounded-lg shadow-md">
              <p className="flex justify-between">
                <span>Trip Cost</span>
                <span>Rs {tripCost.toLocaleString()}.00</span>
              </p>
              <p className="flex justify-between">
                <span>Handling Fee</span>
                <span>Rs {handlingFee.toLocaleString()}.00</span>
              </p>
              <hr className="my-2" />
              <p className="flex justify-between font-semibold">
                <span>Total</span>
                <span>Rs {totalCost.toLocaleString()}.00</span>
              </p>
            </div>

            {/* Request Button */}
            <button
              type="submit"
              className="w-full mt-4 bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            >
              Request Vehicle
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookVehicle;