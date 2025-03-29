import React from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';

// Placeholder images for hotels
const hotelImages = {
  'Hotel A': 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'Hotel B': 'https://images.unsplash.com/photo-1611892440504-42a792e24c48?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'Hotel C': 'https://images.unsplash.com/photo-1596436889106-be35e843f974?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
};

const HotelBooking = () => {
  const hotels = [
    { id: 1, name: 'Hotel A', location: 'City X', price: 100, rating: 4.5 },
    { id: 2, name: 'Hotel B', location: 'City Y', price: 150, rating: 4.0 },
    { id: 3, name: 'Hotel C', location: 'City Z', price: 80, rating: 3.8 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      <SidebarUser />
      <div className="flex-1">
        <HeaderUser />
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">Hotel Booking</h1>
          <div className="grid md:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={hotelImages[hotel.name] || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={hotel.name}
                    className="w-full h-56 object-cover rounded-t-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl"></div>
                  <h2 className="absolute bottom-4 left-4 text-2xl font-semibold text-white">{hotel.name}</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">Location: {hotel.location}</p>
                  <p className="text-gray-600">Price: ${hotel.price}/night</p>
                  <p className="text-gray-600">Rating: {hotel.rating}/5</p>
                  <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md">
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;