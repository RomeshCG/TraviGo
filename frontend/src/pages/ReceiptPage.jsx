import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReceiptPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptData = location.state;

  if (!receiptData) {
    return <div className="text-center text-red-500">No receipt data found.</div>;
  }

  const { bookingId, totalPrice, firstName, lastName, email, checkInDate, checkOutDate } = receiptData;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 py-10 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
        <h1 className="text-2xl font-bold text-blue-800 mb-4 text-center">Payment Receipt</h1>
        <p className="text-gray-700 mb-2"><strong>Booking ID:</strong> {bookingId}</p>
        <p className="text-gray-700 mb-2"><strong>Name:</strong> {firstName} {lastName}</p>
        <p className="text-gray-700 mb-2"><strong>Email:</strong> {email}</p>
        <p className="text-gray-700 mb-2"><strong>Check-In Date:</strong> {new Date(checkInDate).toLocaleDateString()}</p>
        <p className="text-gray-700 mb-2"><strong>Check-Out Date:</strong> {new Date(checkOutDate).toLocaleDateString()}</p>
        <p className="text-gray-700 mb-4"><strong>Total Price:</strong> ${totalPrice.toFixed(2)}</p>
        <button
          onClick={() => navigate('/hotels')}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Back to Menu
        </button>
      </div>
    </div>
  );
};

export default ReceiptPage;