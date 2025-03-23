import React from 'react';

const TravelPackages = () => {
  const packages = [
    { id: 1, name: 'Paris Adventure', duration: '5 days', price: 1000, rating: 4.8 },
    { id: 2, name: 'New York City Tour', duration: '3 days', price: 800, rating: 4.5 },
    { id: 3, name: 'Tokyo Cultural Experience', duration: '7 days', price: 1200, rating: 4.9 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Travel Packages</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-full h-48 bg-gray-200 rounded-t-lg" /> {/* Placeholder for image */}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">{pkg.name}</h2>
              <p className="text-gray-600">Duration: {pkg.duration}</p>
              <p className="text-gray-600">Price: ${pkg.price}</p>
              <p className="text-gray-600">Rating: {pkg.rating}/5</p>
              <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all">
                Book Package
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TravelPackages;