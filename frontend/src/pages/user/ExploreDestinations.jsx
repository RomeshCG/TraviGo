import React from 'react';

const ExploreDestinations = () => {
  const destinations = [
    { id: 1, name: 'Paris', country: 'France', description: 'Discover the city of love with its iconic Eiffel Tower and charming streets.' },
    { id: 2, name: 'New York', country: 'USA', description: 'Experience the hustle and bustle of the Big Apple with its skyscrapers and culture.' },
    { id: 3, name: 'Tokyo', country: 'Japan', description: 'Immerse yourself in a blend of tradition and modernity in this vibrant city.' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Explore Destinations</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <div
            key={destination.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-full h-48 bg-gray-200 rounded-t-lg" /> {/* Placeholder for image */}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">{destination.name}, {destination.country}</h2>
              <p className="text-gray-600 mt-2">{destination.description}</p>
              <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all">
                Explore Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreDestinations;