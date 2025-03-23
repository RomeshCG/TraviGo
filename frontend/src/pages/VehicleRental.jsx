import React from 'react';

const VehicleRental = () => {
  const vehicles = [
    { id: 1, type: 'Sedan', make: 'Toyota', model: 'Camry', price: 50, available: true },
    { id: 2, type: 'SUV', make: 'Honda', model: 'CR-V', price: 70, available: false },
    { id: 3, type: 'Van', make: 'Ford', model: 'Transit', price: 90, available: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Vehicle Rental</h1>
      <div className="grid md:grid-cols-3 gap-6">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="w-full h-48 bg-gray-200 rounded-t-lg" /> {/* Placeholder for image */}
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {vehicle.type} - {vehicle.make} {vehicle.model}
              </h2>
              <p className="text-gray-600">Price: ${vehicle.price}/day</p>
              <p className="text-gray-600">
                Available: <span className={vehicle.available ? 'text-green-600' : 'text-red-600'}>{vehicle.available ? 'Yes' : 'No'}</span>
              </p>
              <button
                className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all disabled:opacity-50"
                disabled={!vehicle.available}
              >
                Rent Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleRental;