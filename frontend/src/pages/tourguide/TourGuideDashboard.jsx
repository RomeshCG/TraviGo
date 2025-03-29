import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleHeader from '../../components/SimpleHeader';
import Footer from '../../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TourGuideDashboard = () => {
  const [tourGuide, setTourGuide] = useState(null);
  const [tourPackages, setTourPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tourGuideBookings, setTourGuideBookings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null); // New state for banner file
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    languages: [],
    yearsOfExperience: 0,
    certification: '',
  });
  const navigate = useNavigate();

  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    const fetchTourGuideData = async () => {
      setIsLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('providerToken');
        if (!token) {
          setError('You need to log in to access the dashboard.');
          setTimeout(() => navigate('/service-provider/login'), 2000);
          return;
        }

        const providerResponse = await fetch(`${BASE_URL}/api/verify-provider-token`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!providerResponse.ok) {
          const errorData = await providerResponse.json();
          throw new Error(errorData.message || 'Failed to verify provider');
        }
        const providerData = await providerResponse.json();
        const provider = providerData.provider;

        let response = await fetch(`${BASE_URL}/api/tour-guide/provider/${provider._id}`);
        if (response.status === 404) {
          const createResponse = await fetch(`${BASE_URL}/api/tour-guide/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              providerId: provider._id,
              name: provider.email.split('@')[0],
              bio: '',
              location: '',
              languages: [],
              yearsOfExperience: 0,
              certification: '',
            }),
          });

          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(errorData.message || 'Failed to create tour guide');
          }

          response = await fetch(`${BASE_URL}/api/tour-guide/provider/${provider._id}`);
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch tour guide data');
        }

        const data = await response.json();
        setTourGuide(data);

        if (data) {
          setFormData({
            name: data.name || '',
            bio: data.bio || '',
            location: data.location || '',
            languages: data.languages || [],
            yearsOfExperience: data.yearsOfExperience || 0,
            certification: data.certification || '',
          });
        }

        if (data._id) {
          const packagesResponse = await fetch(`${BASE_URL}/api/tour-guide/${data._id}/tour-packages`);
          if (packagesResponse.ok) {
            const packagesData = await packagesResponse.json();
            setTourPackages(packagesData);
          } else {
            setTourPackages([]);
          }

          const reviewsResponse = await fetch(`${BASE_URL}/api/tour-guide/${data._id}/reviews`);
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData.reviews || []);
            setAverageRating(reviewsData.averageRating || 0);
          } else {
            setReviews([]);
            setAverageRating(0);
          }

          const bookingsResponse = await fetch(`${BASE_URL}/api/tour-guide/${data._id}/tour-guide-bookings`);
          if (bookingsResponse.ok) {
            const bookingsData = await bookingsResponse.json();
            setTourGuideBookings(bookingsData);
          } else {
            setTourGuideBookings([]);
          }
        } else {
          throw new Error('Invalid tour guide ID');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourGuideData();
  }, [navigate]);

  const handlePublish = async (packageId) => {
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/api/tour-guide/tour-package/${packageId}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        setTourPackages(tourPackages.map(pkg =>
          pkg._id === packageId ? { ...pkg, status: 'published' } : pkg
        ));
        toast.success('Tour package published successfully!');
        setTimeout(() => navigate('/tour-guide/dashboard'), 2000);
      } else {
        setError(data.message || 'Failed to publish tour package');
      }
    } catch (err) {
      setError(`Failed to publish tour package: ${err.message}`);
    }
  };

  const handleDelete = async (packageId) => {
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/api/tour-guide/tour-package/${packageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        setTourPackages(tourPackages.filter(pkg => pkg._id !== packageId));
        toast.success('Tour package deleted successfully!');
        setTimeout(() => navigate('/tour-guide/dashboard'), 2000);
      } else {
        setError(data.message || 'Failed to delete tour package');
      }
    } catch (err) {
      setError(`Failed to delete tour package: ${err.message}`);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!profilePictureFile) {
      setError('Please select a profile picture file');
      return;
    }
    setError('');
    try {
      const formData = new FormData();
      formData.append('tourGuideId', tourGuide._id);
      formData.append('profilePicture', profilePictureFile);
      const response = await fetch(`${BASE_URL}/api/tour-guide/update-profile-picture`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setTourGuide({ ...tourGuide, profilePicture: data.tourGuide.profilePicture });
        toast.success('Profile picture updated successfully!');
        setProfilePictureFile(null);
      } else {
        setError(data.message || 'Failed to update profile picture');
      }
    } catch (err) {
      setError(`Failed to connect to the server: ${err.message}`);
    }
  };

  const handleUpdateBanner = async () => { // New function for banner upload
    if (!bannerFile) {
      setError('Please select a banner file');
      return;
    }
    setError('');
    try {
      const formData = new FormData();
      formData.append('tourGuideId', tourGuide._id);
      formData.append('banner', bannerFile);
      const response = await fetch(`${BASE_URL}/api/tour-guide/update-banner`, {
        method: 'PUT',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setTourGuide({ ...tourGuide, banner: data.tourGuide.banner });
        toast.success('Banner updated successfully!');
        setBannerFile(null);
      } else {
        setError(data.message || 'Failed to update banner');
      }
    } catch (err) {
      setError(`Failed to connect to the server: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'languages') {
      setFormData({ ...formData, languages: value.split(',').map(lang => lang.trim()) });
    } else if (name === 'yearsOfExperience') {
      setFormData({ ...formData, yearsOfExperience: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${BASE_URL}/api/tour-guide/update-profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourGuideId: tourGuide._id,
          ...formData,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTourGuide({ ...tourGuide, ...formData });
        setIsEditing(false);
        toast.success('Profile updated successfully!');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('providerToken');
    toast.success('Logged out successfully!');
    setTimeout(() => navigate('/service-provider/login', { replace: true }), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      <SimpleHeader />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover />
      <div className="flex-grow container mx-auto p-6 md:p-10 mt-20 mb-12">
        {error && <p className="text-red-600 text-center mb-6 font-medium bg-red-100 py-3 rounded-lg">{error}</p>}
        {isLoading ? (
          <div className="text-center">
            <p className="text-gray-600 text-lg">Loading...</p>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-blue-500 h-12 w-12 mx-auto mt-4 animate-spin"></div>
          </div>
        ) : tourGuide ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Section */}
            <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl p-6 transform hover:shadow-2xl transition-shadow duration-300">
              <div className="flex flex-col items-center mb-6">
                {/* Banner Display */}
                <div className="w-full mb-4">
                  <img
                    src={tourGuide.banner ? `${BASE_URL}${tourGuide.banner}` : 'https://via.placeholder.com/300x100?text=No+Banner'}
                    alt="Banner"
                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                  />
                </div>
                <div className="relative">
                  <img
                    src={tourGuide.profilePicture ? `${BASE_URL}${tourGuide.profilePicture}` : 'https://via.placeholder.com/100'}
                    alt="Profile"
                    className="w-28 h-28 rounded-full border-4 border-gradient-to-r from-blue-500 to-indigo-500 shadow-lg"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20"></div>
                </div>
                <div className="text-center mt-4">
                  <h2 className="text-2xl font-bold text-gray-800">{tourGuide.name}</h2>
                  {tourGuide.verifiedBadge && (
                    <span className="inline-flex items-center bg-green-500 text-white text-sm px-3 py-1 rounded-full mt-2 shadow-md">
                      Verified <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </span>
                  )}
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Update Profile Picture</label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md">
                    Choose File
                    <input
                      type="file"
                      onChange={(e) => setProfilePictureFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  <span className="text-gray-600 text-sm truncate">{profilePictureFile ? profilePictureFile.name : 'No file chosen'}</span>
                </div>
                <button
                  onClick={handleUpdateProfilePicture}
                  className="mt-4 w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-2 rounded-lg hover:from-indigo-700 hover:to-blue-700 transition shadow-md"
                >
                  Update Profile Picture
                </button>
              </div>

              {/* Banner Upload Section */}
              <div className="mb-6">
                <label className="block text-gray-700 mb-2 font-medium">Update Banner</label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-md">
                    Choose File
                    <input
                      type="file"
                      onChange={(e) => setBannerFile(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                  <span className="text-gray-600 text-sm truncate">{bannerFile ? bannerFile.name : 'No file chosen'}</span>
                </div>
                <button
                  onClick={handleUpdateBanner}
                  className="mt-4 w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition shadow-md"
                >
                  Update Banner
                </button>
              </div>

              {/* Edit Profile Button */}
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition shadow-md mb-6"
              >
                {isEditing ? 'Cancel Edit' : 'Edit Profile'}
              </button>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition shadow-md mb-6"
              >
                Logout
              </button>

              {/* Profile Details or Edit Form */}
              {isEditing ? (
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Languages (comma-separated)</label>
                    <input
                      type="text"
                      name="languages"
                      value={formData.languages.join(', ')}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., English, Spanish, French"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Years of Experience</label>
                    <input
                      type="number"
                      name="yearsOfExperience"
                      value={formData.yearsOfExperience}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">Certification</label>
                    <input
                      type="text"
                      name="certification"
                      value={formData.certification}
                      onChange={handleInputChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition shadow-md"
                  >
                    Save Changes
                  </button>
                </form>
              ) : (
                <div className="space-y-4 text-gray-700">
                  <p><strong className="font-semibold">Bio:</strong> {tourGuide.bio || 'Not provided'}</p>
                  <p><strong className="font-semibold">Location:</strong> {tourGuide.location || 'Not specified'}</p>
                  <p><strong className="font-semibold">Languages:</strong> {tourGuide.languages?.join(', ') || 'Not specified'}</p>
                  <p><strong className="font-semibold">Years of Experience:</strong> {tourGuide.yearsOfExperience || '0'}</p>
                  <p><strong className="font-semibold">Certification:</strong> {tourGuide.certification || 'Not provided'}</p>
                  <p><strong className="font-semibold">Verification Status:</strong> {tourGuide.verificationStatus || 'Pending'}</p>
                  <p><strong className="font-semibold">Average Rating:</strong> {averageRating ? averageRating.toFixed(1) : '0'} / 5</p>
                </div>
              )}

              <Link to="/tour-guide/chat" className="mt-6 inline-block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-md">
                Chat with Tourists
              </Link>
            </div>

            {/* Main Content Section */}
            <div className="lg:col-span-3 space-y-8">
              {/* Tour Packages Section */}
              <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:shadow-2xl transition-shadow duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Your Tour Packages</h2>
                  {tourGuide.verificationStatus === 'verified' ? (
                    <Link to="/tour-guide/create-package" className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600 transition shadow-md">
                      Create New Package
                    </Link>
                  ) : (
                    <p className="text-red-600 text-sm font-medium bg-red-100 px-4 py-2 rounded-lg">You must be verified to create tour packages.</p>
                  )}
                </div>
                {tourPackages.length === 0 ? (
                  <p className="text-gray-600 text-lg">No tour packages created yet.</p>
                ) : (
                  <div className="space-y-6">
                    {tourPackages.map((pkg) => (
                      <div key={pkg._id} className="border border-gray-200 p-6 rounded-xl flex justify-between items-center hover:bg-gray-50 transition-all duration-300 shadow-sm">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-800">{pkg.title}</h3>
                          <p className="text-gray-600 mt-1">{pkg.description}</p>
                          <p className="text-gray-600 mt-1">Status: <span className={`font-medium ${pkg.status === 'published' ? 'text-green-600' : 'text-yellow-600'}`}>{pkg.status}</span></p>
                          <p className="text-gray-600 mt-1">Price: <span className="font-medium">${pkg.price}</span></p>
                          <p className="text-gray-600 mt-1">Duration: <span className="font-medium">{pkg.duration}</span></p>
                          <p className="text-gray-600 mt-1">Location: <span className="font-medium">{pkg.location}</span></p>
                        </div>
                        <div className="space-x-3">
                          {pkg.status === 'draft' && (
                            <button
                              onClick={() => handlePublish(pkg._id)}
                              className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition shadow-md"
                            >
                              Publish
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(pkg._id)}
                            className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-red-600 hover:to-pink-600 transition shadow-md"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Tour Guide Bookings Section */}
              <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:shadow-2xl transition-shadow duration-300">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Tour Guide Bookings</h2>
                {tourGuideBookings.length === 0 ? (
                  <p className="text-gray-600 text-lg">No tour guide bookings yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-xl shadow-sm">
                      <thead>
                        <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                          <th className="py-4 px-6 text-left text-gray-700 font-semibold">Booking ID</th>
                          <th className="py-4 px-6 text-left text-gray-700 font-semibold">Tourist</th>
                          <th className="py-4 px-6 text-left text-gray-700 font-semibold">Tour Package</th>
                          <th className="py-4 px-6 text-left text-gray-700 font-semibold">Booking Date</th>
                          <th className="py-4 px-6 text-left text-gray-700 font-semibold">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tourGuideBookings.map((booking, index) => (
                          <tr key={booking._id} className={`border-t ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-gray-100 transition-all duration-200`}>
                            <td className="py-4 px-6 text-gray-600">{booking._id}</td>
                            <td className="py-4 px-6 text-gray-600">{booking.touristId?.username || 'Unknown'}</td>
                            <td className="py-4 px-6 text-gray-600">{booking.tourPackageId?.title || 'N/A'}</td>
                            <td className="py-4 px-6 text-gray-600">{new Date(booking.bookingDate).toLocaleDateString()}</td>
                            <td className="py-4 px-6">
                              <span
                                className={`inline-block px-3 py-1 rounded-full text-sm font-medium shadow-sm ${
                                  booking.status === 'pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : booking.status === 'confirmed'
                                    ? 'bg-green-100 text-green-800'
                                    : booking.status === 'completed'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-red-100 text-red-800'
                                }`}
                              >
                                {booking.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Reviews Section */}
              <div className="bg-white rounded-2xl shadow-xl p-6 transform hover:shadow-2xl transition-shadow duration-300">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">Your Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-gray-600 text-lg">No reviews yet.</p>
                ) : (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border border-gray-200 p-6 rounded-xl hover:bg-gray-50 transition-all duration-300 shadow-sm">
                        <p className="text-gray-600">
                          <strong className="font-semibold">{review.touristId?.username || 'Anonymous'}</strong> rated <span className="font-medium text-yellow-600">{review.rating}/5</span>
                        </p>
                        <p className="text-gray-600 mt-2">{review.comment}</p>
                        <p className="text-gray-500 text-sm mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">No tour guide data available.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TourGuideDashboard;