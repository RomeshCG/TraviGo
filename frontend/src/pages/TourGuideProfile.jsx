import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader'; 
import Footer from '../components/Footer'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TourGuideProfile = () => {
  const { providerId } = useParams(); // Get providerId from URL
  const [tourGuide, setTourGuide] = useState(null);
  const [tourPackages, setTourPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchTourGuideData = async () => {
      try {
        // Fetch tour guide details
        const guideResponse = await fetch(`${BASE_URL}/api/tour-guide/provider/${providerId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // User token, if required
          },
        });
        if (!guideResponse.ok) {
          throw new Error('Failed to fetch tour guide details');
        }
        const guideData = await guideResponse.json();
        setTourGuide(guideData);

        // Fetch tour guide's published packages
        const packagesResponse = await fetch(`${BASE_URL}/api/tour-guide/${guideData._id}/tour-packages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!packagesResponse.ok) {
          throw new Error('Failed to fetch tour packages');
        }
        const packagesData = await packagesResponse.json();
        // Filter for published packages only
        setTourPackages(packagesData.filter(pkg => pkg.status === 'published'));
      } catch (error) {
        setError(error.message);
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTourGuideData();
  }, [providerId]);

  const handleBookNow = (packageId) => {
    // Redirect to a booking page or handle booking logic here
    navigate(`/book-tour-package/${packageId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <SimpleHeader />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover />
      <div className="flex-grow container mx-auto p-6 md:p-10 mt-20 mb-12">
        {error && (
          <p className="text-red-600 text-center mb-6 font-medium bg-red-100 py-3 rounded-lg">{error}</p>
        )}

        {loading ? (
          <div className="text-center">
            <p className="text-gray-600 text-lg">Loading tour guide profile...</p>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-green-500 h-12 w-12 mx-auto mt-4 animate-spin"></div>
          </div>
        ) : !tourGuide ? (
          <p className="text-center text-gray-600 text-lg">Tour guide not found.</p>
        ) : (
          <div className="space-y-12">
            {/* Profile Section */}
            <section className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative">
                {/* Banner */}
                <img
                  src={tourGuide.banner ? `${BASE_URL}${tourGuide.banner}` : 'https://via.placeholder.com/1200x400?text=Tour+Guide+Banner'}
                  alt={`${tourGuide.name}'s Banner`}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 to-transparent"></div>
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 flex items-end space-x-4">
                  <img
                    src={tourGuide.profilePicture ? `${BASE_URL}${tourGuide.profilePicture}` : 'https://via.placeholder.com/150'}
                    alt={`${tourGuide.name}'s Profile`}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-green-500 shadow-lg"
                  />
                  <div className="text-white">
                    <h1 className="text-2xl md:text-4xl font-bold">{tourGuide.name}</h1>
                    {tourGuide.verifiedBadge && (
                      <span className="inline-flex items-center bg-green-500 text-white text-sm px-3 py-1 rounded-full mt-2 shadow-md">
                        Verified <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <p className="mb-2"><strong className="font-semibold text-green-600">Bio:</strong> {tourGuide.bio || 'No bio available'}</p>
                    <p className="mb-2"><strong className="font-semibold text-green-600">Location:</strong> {tourGuide.location || 'Not specified'}</p>
                    <p className="mb-2"><strong className="font-semibold text-green-600">Languages:</strong> {tourGuide.languages?.join(', ') || 'Not listed'}</p>
                  </div>
                  <div>
                    <p className="mb-2"><strong className="font-semibold text-green-600">Experience:</strong> {tourGuide.yearsOfExperience ? `${tourGuide.yearsOfExperience} years` : 'N/A'}</p>
                    <p className="mb-2"><strong className="font-semibold text-green-600">Certification:</strong> {tourGuide.certification || 'Not provided'}</p>
                    <p><strong className="font-semibold text-green-600">Rating:</strong> {tourGuide.averageRating ? `${tourGuide.averageRating.toFixed(1)} / 5` : 'No ratings yet'}</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tour Packages Section */}
            <section className="space-y-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center">
                Available <span className="bg-gradient-to-r from-green-500 to-teal-500 text-transparent bg-clip-text">Tour Packages</span>
              </h2>
              {tourPackages.length === 0 ? (
                <p className="text-center text-gray-600 text-lg">No tour packages available at the moment.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {tourPackages.map((pkg) => (
                    <div
                      key={pkg._id}
                      className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
                    >
                      {/* Package Image */}
                      <div className="h-48 overflow-hidden">
                        <img
                          src={pkg.images && pkg.images.length > 0 ? `${BASE_URL}${pkg.images[0]}` : 'https://via.placeholder.com/400x200?text=Tour+Package'}
                          alt={pkg.title}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        />
                      </div>

                      {/* Package Details */}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">{pkg.title}</h3>
                        <p className="text-gray-600 line-clamp-2 mb-4">{pkg.description}</p>
                        <div className="space-y-2 text-gray-700">
                          <p><strong className="font-semibold text-green-600">Price:</strong> ${pkg.price}</p>
                          <p><strong className="font-semibold text-green-600">Duration:</strong> {pkg.duration}</p>
                          <p><strong className="font-semibold text-green-600">Location:</strong> {pkg.location}</p>
                          <p><strong className="font-semibold text-green-600">Max Participants:</strong> {pkg.maxParticipants}</p>
                        </div>
                        <button
                          onClick={() => handleBookNow(pkg._id)}
                          className="mt-4 w-full bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition shadow-md"
                        >
                          Book Now
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TourGuideProfile;