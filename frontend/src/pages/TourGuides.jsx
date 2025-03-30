// src/pages/TourGuides.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader'; // Adjust path as needed
import Footer from '../components/Footer'; // Adjust path as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TourGuides = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchTourGuides = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/tour-guides`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched tour guides (frontend):', data);
        setTourGuides(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching tour guides:', error);
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTourGuides();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      <SimpleHeader />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover />
      <div className="flex-grow container mx-auto p-6 md:p-10 mt-20 mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">
          Discover Your Perfect{' '}
          <span className="bg-gradient-to-r from-green-500 to-teal-500 text-transparent bg-clip-text">Tour Guide</span>
        </h1>

        {error && (
          <p className="text-red-600 text-center mb-6 font-medium bg-red-100 py-3 rounded-lg">{error}</p>
        )}

        {loading ? (
          <div className="text-center">
            <p className="text-gray-600 text-lg">Loading tour guides...</p>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-green-500 h-12 w-12 mx-auto mt-4 animate-spin"></div>
          </div>
        ) : tourGuides.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No tour guides available at the moment.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {tourGuides.map((guide) => (
              <div
                key={guide._id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
              >
                {/* Banner */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={guide.banner ? `${BASE_URL}${guide.banner}` : 'https://via.placeholder.com/400x200?text=Tour+Service+Banner'}
                    alt={`${guide.name}'s Tour Service Banner`}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <img
                        src={guide.profilePicture ? `${BASE_URL}${guide.profilePicture}` : 'https://via.placeholder.com/100'}
                        alt={`${guide.name}'s Profile`}
                        className="w-12 h-12 rounded-full border-4 border-gradient-to-r from-green-500 to-teal-500 shadow-md mr-3"
                      />
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800">{guide.name}</h2>
                        {guide.verifiedBadge && (
                          <span className="inline-flex items-center bg-green-500 text-white text-sm px-2 py-1 rounded-full mt-1 shadow-md">
                            Verified <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-gray-700">
                    <p className="line-clamp-2"><strong className="font-semibold">Bio:</strong> {guide.bio || 'No bio available'}</p>
                    <p><strong className="font-semibold">Location:</strong> {guide.location || 'Not specified'}</p>
                    <p><strong className="font-semibold">Languages:</strong> {guide.languages?.join(', ') || 'Not listed'}</p>
                    <p><strong className="font-semibold">Experience:</strong> {guide.yearsOfExperience ? `${guide.yearsOfExperience} years` : 'N/A'}</p>
                  </div>

                  <Link
                    to={`/tour-guide/${guide.providerId}`}
                    className="mt-4 inline-block w-full text-center bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition shadow-md"
                  >
                    Book Now
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TourGuides;