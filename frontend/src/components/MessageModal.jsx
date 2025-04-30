import React from "react";

const MessageModal = ({ message, type, onClose, showContinue = false }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className={`p-6 rounded-lg shadow-lg ${type === "success" ? "bg-green-100" : "bg-red-100"} max-w-sm w-full`}>
        <h3 className={`text-lg font-semibold ${type === "success" ? "text-green-700" : "text-red-700"}`}>
          {type === "success" ? "Success" : "Error"}
        </h3>
        <p className="mt-2 text-gray-700">{message}</p>
        <button
          onClick={onClose}
          className={`mt-4 w-full py-2 rounded-lg text-white ${type === "success" ? "bg-green-600" : "bg-red-600"} hover:${type === "success" ? "bg-green-700" : "bg-red-700"} transition-colors`}
        >
          {showContinue ? "Continue" : "Close"}
        </button>
      </div>
    </div>
  );
};

export default MessageModal;