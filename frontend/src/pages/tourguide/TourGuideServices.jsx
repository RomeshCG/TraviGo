import { useState, useEffect } from 'react';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';
import backgroundImage from '../assets/login_page_img.jpg';

const TourGuideServices = () => {
  const [tourPackages, setTourPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTourPackages = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/tour-packages/published');
        const data = await response.json();
        if (response.ok) {
          setTourPackages(data);
        } else {
          console.error('Failed to fetch tour packages:', response.status, data);
          setError(data.message || 'Failed to fetch tour packages');
        }
      } catch (err) {
        console.error('Error fetching tour packages:', err.message);
        setError(`Failed to fetch tour packages: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourPackages();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <div
        className="flex-grow flex flex-col items-center justify-center bg-cover bg-center mt-20 lg:mt-24"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        }}
      >
        <h1 className="text-4xl lg:text-5xl font-bold text-white mb-8">Explore Tour Packages</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : tourPackages.length === 0 ? (
          <p className="text-white">No tour packages available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {tourPackages.map((pkg) => (
              <div key={pkg._id} className="bg-white rounded-lg shadow-lg p-4">
                <img
                  src={pkg.images && pkg.images.length > 0 ? pkg.images[0] : 'https://via.placeholder.com/300'}
                  alt={pkg.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h2 className="text-xl font-semibold">{pkg.title}</h2>
                <p className="text-gray-600">{pkg.description}</p>
                <p className="text-gray-800 font-bold mt-2">Price: ${pkg.price}</p>
                <p className="text-gray-600">Duration: {pkg.duration}</p>
                <p className="text-gray-600">Location: {pkg.location}</p>
                <button
                  onClick={() => alert('Contact the tour guide to book!')}
                  className="mt-4 bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TourGuideServices;