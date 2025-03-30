import React from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';

const MyBooking = () => {
  const bookings = [
    { id: 1, type: 'Hotel', name: 'Hotel A', location: 'City X', date: '2025-04-01', price: 100 },
    { id: 2, type: 'Vehicle', name: 'Toyota Camry', duration: '3 days', date: '2025-04-02', price: 150 },
    { id: 3, type: 'Tour Guide', name: 'Guide A', date: '2025-04-03', price: 80 },
    { id: 4, type: 'Travel Package', name: 'Paris - 5 days', date: '2025-04-05', price: 1000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      <SidebarUser />
      <div className="flex-1">
        <HeaderUser />
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">My Bookings</h1>
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center hover:shadow-xl transition-all duration-300"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{booking.type}: {booking.name}</h2>
                  <p className="text-gray-600">{booking.location || booking.duration || 'N/A'}</p>
                  <p className="text-gray-600">Date: {booking.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">${booking.price}</p>
                  <button className="mt-2 text-blue-600 hover:text-blue-800 transition-all">View Details</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBooking;