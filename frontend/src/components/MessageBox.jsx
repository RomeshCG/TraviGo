import React from 'react';

const MessageBox = ({ message, totalPrice, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Successful</h2>
        <p className="text-gray-700">{message}</p>
        <p className="text-gray-900 font-semibold mt-2">Total: ${totalPrice.toFixed(2)}</p>
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default MessageBox;