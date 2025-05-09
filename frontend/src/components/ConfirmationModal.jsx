import React from "react";

   const ConfirmationModal = ({ bookingData, accommodation, roomIndex, onConfirm, onEdit }) => {
     const nights = bookingData
       ? Math.ceil((new Date(bookingData.checkOutDate) - new Date(bookingData.checkInDate)) / (1000 * 60 * 60 * 24))
       : 0;

     return (
       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4">
           <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Your Booking</h2>
           <div className="space-y-3">
             <p className="text-gray-700">
               <strong>Accommodation:</strong> {accommodation?.accommodationType} - {accommodation?.name}
             </p>
             <p className="text-gray-700"><strong>Location:</strong> {accommodation?.location}</p>
             <p className="text-gray-700"><strong>Room Type:</strong> {accommodation?.rooms[roomIndex]?.type}</p>
             <p className="text-gray-700"><strong>Name:</strong> {bookingData?.firstName} {bookingData?.lastName}</p>
             <p className="text-gray-700"><strong>Email:</strong> {bookingData?.email}</p>
             <p className="text-gray-700"><strong>Phone:</strong> {bookingData?.phoneNumber}</p>
             <p className="text-gray-700">
               <strong>Check-In:</strong> {new Date(bookingData?.checkInDate).toLocaleDateString()}
             </p>
             <p className="text-gray-700">
               <strong>Check-Out:</strong> {new Date(bookingData?.checkOutDate).toLocaleDateString()}
             </p>
             <p className="text-gray-700"><strong>Nights:</strong> {nights}</p>
             <p className="text-gray-700"><strong>Total Price:</strong> ${bookingData?.totalPrice.toFixed(2)}</p>
             {bookingData?.specialRequests && (
               <p className="text-gray-700"><strong>Special Requests:</strong> {bookingData.specialRequests}</p>
             )}
           </div>
           <div className="mt-6 flex justify-end space-x-4">
             <button
               onClick={onEdit}
               className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
             >
               Edit Booking
             </button>
             <button
               onClick={onConfirm}
               className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
             >
               Confirm Booking
             </button>
           </div>
         </div>
       </div>
     );
   };

   export default ConfirmationModal;