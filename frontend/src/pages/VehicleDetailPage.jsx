import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const VehicleDetailPage = () => {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch vehicle by ID from the backend
  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const response = await fetch(`/api/vehicles/${id}`);
        if (!response.ok) throw new Error('Vehicle not found');
        const data = await response.json();
        setVehicle(data);
        setMainImage(data.imageArray[0] || data.image);
        setLoading(false);
      } catch (err) {
        setError('Vehicle not found or failed to load.');
        setLoading(false);
      }
    };
    fetchVehicle();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <p className="text-xl font-semibold text-gray-300 animate-pulse">Loading vehicle details...</p>
      </div>
    );
  }

  if (error || !vehicle) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800">
        <h1 className="text-3xl font-bold text-white mb-4">
          {error || 'Vehicle Not Found'}
        </h1>
        <Link
          to="/vehicles"
          className="text-blue-400 hover:text-blue-300 text-lg font-medium transition-colors duration-200"
        >
          ← Back to Vehicles
        </Link>
      </div>
    );
  }

  const {
    name,
    imageArray,
    location,
    price,
    engine,
    doors,
    seats,
    fuel,
    transmission,
    description,
  } = vehicle;

  const handleHireNow = () => {
    navigate('/rent', { state: { totalPrice: price, vehicle } });
  };

  // Dummy reviews
  const reviews = [
    {
      id: 1,
      author: 'John Doe',
      rating: 5,
      comment: 'Absolutely loved this vehicle! Smooth ride, great fuel efficiency, and the interior was spotless. Highly recommend!',
      date: 'October 15, 2024',
    },
    {
      id: 2,
      author: 'Sarah Smith',
      rating: 4,
      comment: 'Really enjoyed driving this car. It’s perfect for city trips, though I wish it had a bit more trunk space. Still a great choice!',
      date: 'September 28, 2024',
    },
    {
      id: 3,
      author: 'Mike Johnson',
      rating: 5,
      comment: 'Fantastic experience! The staff was super helpful, and the vehicle was in top condition. Will definitely rent again.',
      date: 'August 10, 2024',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-800">
      <Header />
      <div className="pt-20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-700 to-blue-600 p-6 text-white">
            <Link
              to="/vehicles"
              className="inline-flex items-center text-white hover:text-gray-200 transition-colors duration-200 text-lg font-medium"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Vehicles
            </Link>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight">{name}</h1>
          </div>

          {/* Main Content */}
          <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image Section */}
            <div className="space-y-6">
              <div className="relative group">
                <img
                  src={mainImage || imageArray[0] || vehicle.image}
                  alt={name}
                  className="w-full h-96 object-cover rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              {imageArray && imageArray.length > 0 && (
                <div className="grid grid-cols-5 gap-3">
                  {imageArray.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`${name} ${index + 1}`}
                      className={`w-full h-20 object-cover rounded-md cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-md ${
                        mainImage === img ? 'ring-2 ring-indigo-600' : 'ring-1 ring-gray-300'
                      }`}
                      onClick={() => setMainImage(img)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Vehicle Details</h2>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-gray-700 text-lg">
                  <p>
                    <strong className="font-medium">Location:</strong> {location}
                  </p>
                  <p>
                    <strong className="font-medium">Engine:</strong> {engine}
                  </p>
                  <p>
                    <strong className="font-medium">Doors:</strong> {doors}
                  </p>
                  <p>
                    <strong className="font-medium">Seats:</strong> {seats}
                  </p>
                  <p>
                    <strong className="font-medium">Fuel:</strong> {fuel}
                  </p>
                  <p>
                    <strong className="font-medium">Transmission:</strong> {transmission}
                  </p>
                </div>
              </div>

              {/* Price Section */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-semibold text-gray-900 mb-3">Pricing</h2>
                <p className="text-gray-800 text-xl">
                  <strong className="font-medium">Price per day:</strong> ${price}
                </p>
              </div>

              <button
                onClick={handleHireNow}
                className="w-full bg-indigo-600 text-white text-lg font-semibold py-4 rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-opacity-50"
              >
                Hire Now
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Description</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
          </div>

          {/* Reviews Section */}
          <div className="p-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Customer Reviews</h2>
            <div className="space-y-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-xl">
                        {review.author[0]}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{review.author}</h3>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="text-yellow-500 text-lg">
                        {'★'.repeat(review.rating)}
                      </span>
                      <span className="text-gray-300 text-lg">
                        {'★'.repeat(5 - review.rating)}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailPage;