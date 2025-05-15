import React, { useEffect, useState } from 'react';
import VehicleCard from '../components/VehicleCard';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const VEHICLE_TYPES = ["All", "Car", "Bus", "SUV", "Van", "Tuk Tuk", "Bike"];
const LOCATIONS = [
  "All", "Colombo", "Kandy", "Galle", "Anuradhapura", "Matara",
  "Kurunegala", "Jaffna", "Gampaha", "Negambo", "Kalutara", "Nuwaraeliya"
];

const VehiclesPage = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [vehicleType, setVehicleType] = useState('All');
  const [location, setLocation] = useState('All');

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

  // Filter by vehicle type and location
  const filteredVehicles = vehicles.filter(v =>
    (vehicleType === "All" ? true : v.vehicleType === vehicleType) &&
    (location === "All" ? true : v.location === location)
  );

  // Sort by price
  const sortedVehicles = [...filteredVehicles].sort((a, b) => {
    if (sortOrder === "lowToHigh") return (a.pricePerDay || 0) - (b.pricePerDay || 0);
    if (sortOrder === "highToLow") return (b.pricePerDay || 0) - (a.pricePerDay || 0);
    return 0;
  });

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 px-4 pt-32">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-900 mb-12 tracking-tight drop-shadow-lg">
            Our Vehicles
          </h1>

          {/* Sorting & Filtering Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div className="flex items-center gap-2">
              <label className="font-medium text-blue-800">Sort by price:</label>
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Default</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium text-blue-800">Vehicle type:</label>
              <select
                value={vehicleType}
                onChange={e => setVehicleType(e.target.value)}
                className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {VEHICLE_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="font-medium text-blue-800">Location:</label>
              <select
                value={location}
                onChange={e => setLocation(e.target.value)}
                className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {LOCATIONS.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Loading Spinner */}
          {loading && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-orange-400 border-opacity-50"></div>
              <span className="ml-4 text-lg text-orange-500 font-medium">Loading vehicles...</span>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6 text-center font-semibold">
              {error}
            </div>
          )}

          {/* Vehicle Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-10">
            {sortedVehicles.map(vehicle => (
              <div
                key={vehicle._id}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-orange-100 relative flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={vehicle.images && vehicle.images.length > 0 ? vehicle.images[0] : '/images/placeholder.jpg'}
                    alt={vehicle.vehicleName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-4 left-4 bg-[#ff8468] text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {vehicle.vehicleType}
                  </span>
                </div>
                <div className="flex-1 flex flex-col p-6">
                  <h3 className="text-2xl font-bold text-blue-800 mb-2 group-hover:text-[#ff8468] transition-colors duration-300">
                    {vehicle.vehicleName}
                  </h3>
                  <p className="text-gray-500 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {vehicle.location}
                  </p>
                  <p className="text-[#ff8468] font-semibold text-lg mb-4">
                    ${vehicle.pricePerDay} <span className="text-gray-500 font-normal">/ day</span>
                  </p>
                  <div className="flex-1"></div>
                  <Link
                    to={`/vehicles/${vehicle._id}`}
                    className="mt-4 inline-block bg-[#ff8468] text-white py-2 px-6 rounded-full font-semibold shadow hover:bg-orange-600 transition-all duration-300 text-lg text-center"
                  >
                    View Vehicle
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* No Vehicles Found */}
          {!loading && sortedVehicles.length === 0 && !error && (
            <div className="text-gray-500 mt-16 text-center text-xl font-medium">
              No vehicles available for the selected filter.
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VehiclesPage;