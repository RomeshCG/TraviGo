import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [owner, setOwner] = useState(null); // State for owner details
  const [reviews, setReviews] = useState([]); // State for user reviews
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

          // Fetch owner details
          const ownerRes = await fetch(`http://localhost:5000/api/service-providers/${data.vehicle.providerId}`);
          const ownerData = await ownerRes.json();
          if (ownerRes.ok) {
            setOwner(ownerData.provider);
          }

          // Fetch reviews for the vehicle
          const reviewsRes = await fetch(`http://localhost:5000/api/reviews/vehicle/${id}`);
          const reviewsData = await reviewsRes.json();
          if (reviewsRes.ok) {
            setReviews(reviewsData.reviews || []);
          }

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
      <div className="pt-8"> {/* Padding before header */}
        <SimpleHeader />
      </div>
      <div className="pt-28 pb-12 min-h-screen bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-8">
          {/* Back Arrow */}
          <div className="mb-6">
            <Link to="/user/vehicles" className="text-blue-600 underline text-lg font-semibold">
              &larr; Back to Vehicles
            </Link>
          </div>

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

          {/* Availability Section */}
          <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-[#203c8c] mb-4">Availability</h3>
            {vehicle.availability && vehicle.availability.length > 0 ? (
              <ul className="list-disc pl-6">
                {vehicle.availability.map((range, idx) => (
                  <li key={idx} className="text-gray-700">
                    Not available from{' '}
                    <strong>{new Date(range.startDate).toLocaleDateString()}</strong> to{' '}
                    <strong>{new Date(range.endDate).toLocaleDateString()}</strong>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">This vehicle is available for all dates.</p>
            )}
          </div>

          {/* Owner Contact Section */}
          {owner && (
            <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold text-[#203c8c] mb-4">Contact Owner</h3>
              <p className="text-gray-700"><strong>Name:</strong> {owner.name}</p>
              <p className="text-gray-700"><strong>Email:</strong> {owner.email}</p>
              <p className="text-gray-700"><strong>Phone:</strong> {owner.phoneNumber}</p>
            </div>
          )}

          {/* User Reviews Section */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-[#203c8c] mb-4">User Reviews</h3>
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="bg-gray-100 p-4 rounded-lg shadow-md">
                    <p className="text-gray-700"><strong>{review.userName}</strong></p>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews available for this vehicle.</p>
            )}
          </div>
        </div>
      </div>
      <div className="pb-8"> {/* Padding before footer */}
        <div className="mt-12 border-t-4 border-blue-300 shadow-lg">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default VehicleDetailPage;
