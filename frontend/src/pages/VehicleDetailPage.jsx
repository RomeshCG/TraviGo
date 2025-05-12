import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicle = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(`http://localhost:5000/api/renting-vehicles/${id}`);
        const data = await res.json();
        if (res.ok && data.vehicle) {
          setVehicle(data.vehicle);
          // Use images array for mainImage
          if (data.vehicle.images && data.vehicle.images.length > 0) {
            const img = data.vehicle.images[0];
            setMainImage(
              img.startsWith('uploads/') || img.startsWith('/uploads/')
                ? `http://localhost:5000/${img.replace(/^\//, '')}`
                : img
            );
          } else {
            setMainImage('');
          }
        } else {
          setError(data.message || 'Vehicle not found');
        }
      } catch {
        setError('Server error. Please try again.');
      }
      setLoading(false);
    };
    fetchVehicle();
  }, [id]);

  const handleRentNow = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login page if the user is not logged in
      navigate('/login', { state: { from: `/user/vehicles/rent`, vehicle } });
    } else {
      // Redirect to RentVehiclePage if the user is logged in
      navigate('/user/vehicles/rent', { state: { vehicle } });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <span className="text-lg text-blue-700 font-medium">Loading vehicle details...</span>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-white">
        <h2 className="text-2xl font-bold text-red-600 mb-4">{error || 'Vehicle not found'}</h2>
        <Link to="/user/vehicles" className="text-blue-600 underline">Back to Vehicles</Link>
      </div>
    );
  }

  // Prepare image URLs from images array
  const imageArray = (vehicle && vehicle.images ? vehicle.images : []).map(img =>
    img && (img.startsWith('uploads/') || img.startsWith('/uploads/'))
      ? `http://localhost:5000/${img.replace(/^\//, '')}`
      : img
  );

  return (
    <>
      <SimpleHeader />
      <div className="pt-28 pb-12 min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Image Section */}
            <div className="md:w-1/2 flex flex-col items-center">
              <div className="w-full h-72 mb-4 relative">
                <img
                  src={mainImage || imageArray[0] || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={vehicle.vehicleName || vehicle.name}
                  className="w-full h-72 object-cover rounded-lg shadow-md bg-gray-100"
                />
              </div>
              {imageArray.length > 1 && (
                <div className="flex gap-2 mt-2">
                  {imageArray.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Vehicle ${idx + 1}`}
                      className={`w-16 h-16 object-cover rounded cursor-pointer border-2 ${mainImage === img ? 'border-blue-600' : 'border-gray-200'}`}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              )}
            </div>
            {/* Details Section */}
            <div className="md:w-1/2 flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#203c8c] mb-2">{vehicle.name}</h2>
                <p className="text-gray-700 mb-2"><strong>Location:</strong> {vehicle.location}</p>
                {vehicle.price && <p className="text-gray-700 mb-2"><strong>Price per day:</strong> ${vehicle.price}</p>}
                {vehicle.engine && <p className="text-gray-700 mb-2"><strong>Engine:</strong> {vehicle.engine}</p>}
                {vehicle.doors && <p className="text-gray-700 mb-2"><strong>Doors:</strong> {vehicle.doors}</p>}
                {vehicle.seats && <p className="text-gray-700 mb-2"><strong>Seats:</strong> {vehicle.seats}</p>}
                {vehicle.fuel && <p className="text-gray-700 mb-2"><strong>Fuel:</strong> {vehicle.fuel}</p>}
                {vehicle.transmission && <p className="text-gray-700 mb-2"><strong>Transmission:</strong> {vehicle.transmission}</p>}
                {vehicle.description && <p className="text-gray-700 mt-4">{vehicle.description}</p>}
              </div>
              <button
                className="mt-8 bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg"
                onClick={handleRentNow}
              >
                Rent Now
              </button>
            </div>
          </div>
          <div className="mt-8">
            <Link to="/user/vehicles" className="text-blue-600 underline">&larr; Back to Vehicles</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleDetailPage;
