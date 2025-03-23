import React from 'react';

const HotelBooking = () => {
  const hotels = [
    { id: 1, name: 'Hotel A', location: 'City X', price: 100, rating: 4.5 },
    { id: 2, name: 'Hotel B', location: 'City Y', price: 150, rating: 4.0 },
    { id: 3, name: 'Hotel C', location: 'City Z', price: 80, rating: 3.8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Hotel Booking</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-full h-48 bg-gray-200 rounded-t-lg" /> {/* Placeholder for image */}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">{hotel.name}</h2>
              <p className="text-gray-600">Location: {hotel.location}</p>
              <p className="text-gray-600">Price: ${hotel.price}/night</p>
              <p className="text-gray-600">Rating: {hotel.rating}/5</p>
              <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all">
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HotelBooking;