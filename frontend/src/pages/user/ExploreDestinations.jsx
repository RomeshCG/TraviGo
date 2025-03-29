import React from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';

// Placeholder images for destinations
const destinationImages = {
  Paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'New York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  Tokyo: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
};

const ExploreDestinations = () => {
  const destinations = [
    { id: 1, name: 'Paris', country: 'France', description: 'Discover the city of love with its iconic Eiffel Tower and charming streets.' },
    { id: 2, name: 'New York', country: 'USA', description: 'Experience the hustle and bustle of the Big Apple with its skyscrapers and culture.' },
    { id: 3, name: 'Tokyo', country: 'Japan', description: 'Immerse yourself in a blend of tradition and modernity in this vibrant city.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      <SidebarUser />
      <div className="flex-1">
        <HeaderUser />
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">Explore Destinations</h1>
          <div className="grid md:grid-cols-3 gap-8">
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={destinationImages[destination.name] || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={`${destination.name}, ${destination.country}`}
                    className="w-full h-56 object-cover rounded-t-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl"></div>
                  <h2 className="absolute bottom-4 left-4 text-2xl font-semibold text-white">
                    {destination.name}, {destination.country}
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md">
                    Explore Now
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

export default ExploreDestinations;