import React from "react";

const BankDetailsModal = ({ bankDetails, onClose }) => {
  if (!bankDetails) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(30, 41, 59, 0.15)", backdropFilter: "blur(2px)" }}>
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl border-t-4 border-blue-400 relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-2xl font-bold focus:outline-none"
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">Bank Account Details</h2>
        <div className="space-y-3 text-gray-700 text-base">
          <div><span className="font-semibold">Account Holder Name:</span> {bankDetails.accountHolderName || "-"}</div>
          <div><span className="font-semibold">Bank Name:</span> {bankDetails.bankName || "-"}</div>
          <div><span className="font-semibold">Account Number:</span> {bankDetails.accountNumber || "-"}</div>
          <div><span className="font-semibold">Branch:</span> {bankDetails.branch || "-"}</div>
          <div><span className="font-semibold">SWIFT Code:</span> {bankDetails.swiftCode || "-"}</div>
        </div>
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-600 text-white py-2 px-8 rounded-lg hover:bg-blue-700 transition font-semibold shadow-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BankDetailsModal;
