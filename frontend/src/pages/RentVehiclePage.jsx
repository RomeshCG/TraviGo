import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';

const RentVehiclePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const vehicle = location.state?.vehicle;

  if (!vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <h2 className="text-2xl font-bold text-red-600 mb-4">No vehicle selected for rent.</h2>
        <Link to="/user/vehicles" className="text-blue-600 underline">Back to Vehicles</Link>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Collect form data
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    data.vehicleId = vehicle._id;
    navigate('/user/vehicles/order-summary', { state: { vehicle, formData: data } });
  };

  return (
    <>
      <SimpleHeader />
      <div className="pt-28 pb-12 min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-[#203c8c] mb-6">Rent {vehicle.vehicleName || vehicle.name}</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block font-semibold mb-1">Full Name</label>
              <input name="fullName" required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Email</label>
              <input name="email" type="email" required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Phone</label>
              <input name="phone" required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">Start Date</label>
              <input name="startDate" type="date" required className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold mb-1">End Date</label>
              <input name="endDate" type="date" required className="w-full border rounded px-3 py-2" />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-full font-semibold hover:bg-blue-700 transition-all duration-300">Confirm Rent</button>
          </form>
          <div className="mt-6 text-center">
            <Link to="/user/vehicles" className="text-blue-600 underline">&larr; Back to Vehicles</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default RentVehiclePage;
