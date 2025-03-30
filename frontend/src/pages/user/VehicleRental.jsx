import React from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';

// Placeholder images for vehicles
const vehicleImages = {
  Sedan: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  SUV: 'https://images.unsplash.com/photo-1580273916550-ebdde4c9a7f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
  Van: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
};

const VehicleRental = () => {
  const vehicles = [
    { id: 1, type: 'Sedan', make: 'Toyota', model: 'Camry', price: 50, available: true },
    { id: 2, type: 'SUV', make: 'Honda', model: 'CR-V', price: 70, available: false },
    { id: 3, type: 'Van', make: 'Ford', model: 'Transit', price: 90, available: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      <SidebarUser />
      <div className="flex-1">
        <HeaderUser />
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">Vehicle Rental</h1>
          <div className="grid md:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="relative">
                  <img
                    src={vehicleImages[vehicle.type] || 'https://via.placeholder.com/400x200?text=No+Image'}
                    alt={`${vehicle.make} ${vehicle.model}`}
                    className="w-full h-56 object-cover rounded-t-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-t-2xl"></div>
                  <h2 className="absolute bottom-4 left-4 text-2xl font-semibold text-white">
                    {vehicle.type} - {vehicle.make} {vehicle.model}
                  </h2>
                </div>
                <div className="p-6">
                  <p className="text-gray-600">Price: ${vehicle.price}/day</p>
                  <p className="text-gray-600">
                    Available: <span className={vehicle.available ? 'text-green-600' : 'text-red-600'}>{vehicle.available ? 'Yes' : 'No'}</span>
                  </p>
                  <button
                    className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md disabled:opacity-50"
                    disabled={!vehicle.available}
                  >
                    Rent Now
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

export default VehicleRental;