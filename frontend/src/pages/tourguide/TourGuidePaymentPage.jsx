import React from "react";
import { useNavigate } from "react-router-dom";

const TourGuidePaymentPage = () => {
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      const response = await fetch("/api/tour-guide/payment", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        navigate("/tour-guide/confirmation");
      } else {
        console.error("Payment failed");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-6">Complete Your Payment</h2>
        <p className="mb-4">Please confirm your payment to finalize the booking.</p>
        <button
          onClick={handlePayment}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Confirm Payment
        </button>
      </div>
    </div>
  );
};

export default TourGuidePaymentPage;