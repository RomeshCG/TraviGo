import React, { useEffect, useState } from 'react';
import VehicleCard from '../components/VehicleCard';
import SimpleHeader from '../components/SimpleHeader';

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('http://localhost:5000/api/renting-vehicles');
        const data = await res.json();
        if (res.ok) {
          setVehicles(data.vehicles || []);
        } else {
          setError(data.message || 'Failed to fetch vehicles');
        }
      } catch {
        setError('Server error. Please try again.');
      }
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  return (
    <>
      <SimpleHeader />
      <div className="pt-28 pb-12 min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
              <span className="ml-4 text-lg text-blue-700 font-medium">Loading vehicles...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6 text-center font-semibold">
              {error}
            </div>
          )}

          {/* Vehicle Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {vehicles.map(vehicle => (
              <VehicleCard
                key={vehicle._id}
                vehicle={{
                  ...vehicle,
                  name: vehicle.vehicleName,
                  price: vehicle.pricePerDay,
                  fuel: vehicle.fuelType,
                  image: vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : undefined,
                  imageArray: vehicle.images || [],
                }}
              />
            ))}
          </div>

          {/* No Vehicles Found */}
          {!loading && vehicles.length === 0 && !error && (
            <div className="text-gray-500 mt-16 text-center text-xl font-medium">
              No vehicles available at the moment. Please check back later.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default VehiclesPage;