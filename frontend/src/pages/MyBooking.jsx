import React from 'react';

const MyBooking = () => {
  const bookings = [
    { id: 1, type: 'Hotel', name: 'Hotel A', location: 'City X', date: '2025-04-01', price: 100 },
    { id: 2, type: 'Vehicle', name: 'Toyota Camry', duration: '3 days', date: '2025-04-02', price: 150 },
    { id: 3, type: 'Tour Guide', name: 'Guide A', date: '2025-04-03', price: 80 },
    { id: 4, type: 'Travel Package', name: 'Paris - 5 days', date: '2025-04-05', price: 1000 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white rounded-lg shadow-md p-6 flex justify-between items-center hover:shadow-lg transition-shadow"
          >
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{booking.type}: {booking.name}</h2>
              <p className="text-gray-600">{booking.location || booking.duration || 'N/A'}</p>
              <p className="text-gray-600">Date: {booking.date}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">${booking.price}</p>
              <button className="mt-2 text-blue-600 hover:underline">View Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBooking;