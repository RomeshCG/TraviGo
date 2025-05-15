import React from "react";

const MessageModal = ({ message, type, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl border-l-4 ${type === "success" ? "border-green-500" : "border-red-500"}`}>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          {type === "success" ? "Success" : "Error"}
        </h2>
        <p className="text-gray-700">{message}</p>
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;