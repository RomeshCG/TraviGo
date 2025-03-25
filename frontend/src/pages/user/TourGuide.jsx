
import React from 'react';

const TourGuides = () => {
  const guides = [
    { id: 1, name: 'Guide A', location: 'City X', price: 80, rating: 4.7 },
    { id: 2, name: 'Guide B', location: 'City Y', price: 60, rating: 4.2 },
    { id: 3, name: 'Guide C', location: 'City Z', price: 100, rating: 4.9 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Tour Guides</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {guides.map((guide) => (
          <div
            key={guide.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-full h-48 bg-gray-200 rounded-t-lg" /> {/* Placeholder for image */}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">{guide.name}</h2>
              <p className="text-gray-600">Location: {guide.location}</p>
              <p className="text-gray-600">Price: ${guide.price}/day</p>
              <p className="text-gray-600">Rating: {guide.rating}/5</p>
              <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all">
                Hire Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TourGuides;
