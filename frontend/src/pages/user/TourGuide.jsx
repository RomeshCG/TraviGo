import React from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';

// Placeholder images for tour guides
const guideImages = {
  'Guide A': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'Guide B': 'https://images.unsplash.com/photo-1517841903200-7a706ff3b558?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  'Guide C': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
};

const TourGuides = () => {
  const guides = [
    { id: 1, name: 'Guide A', location: 'City X', price: 80, rating: 4.7 },
    { id: 2, name: 'Guide B', location: 'City Y', price: 60, rating: 4.2 },
    { id: 3, name: 'Guide C', location: 'City Z', price: 100, rating: 4.9 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      <SidebarUser />
      <div className="flex-1">
        <HeaderUser />
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">Tour Guides</h1>
          <div className="grid md:grid-cols-3 gap-8">
            {guides.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={guideImages[guide.name] || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={guide.name}
                    className="w-full h-56 object-cover rounded-t-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl"></div>
                  <h2 className="absolute bottom-4 left-4 text-2xl font-semibold text-white">{guide.name}</h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">Location: {guide.location}</p>
                  <p className="text-gray-600">Price: ${guide.price}/day</p>
                  <p className="text-gray-600">Rating: {guide.rating}/5</p>
                  <button className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md">
                    Hire Now
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

export default TourGuides;