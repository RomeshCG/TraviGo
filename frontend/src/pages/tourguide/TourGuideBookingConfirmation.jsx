import React from "react";

const TourGuideBookingConfirmation = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Booking Confirmed!</h2>
        <p className="mb-4">
          Thank you for booking with us. Your tour guide will contact you soon.
        </p>
        <p className="text-gray-600">Safe travels!</p>
      </div>
    </div>
  );
};

export default TourGuideBookingConfirmation;