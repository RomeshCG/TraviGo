import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TourGuideHeader from '../../components/TourGuideHeader';
import Footer from '../../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TourGuideDashboard = () => {
  const [tourGuide, setTourGuide] = useState(null);
  const [tourPackages, setTourPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tourBookings, setTourBookings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
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

  const fetchTourGuideData = useCallback(async () => {
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
      if (!providerResponse.ok) throw new Error('Failed to verify provider');
      
      const providerData = await providerResponse.json();
      const provider = providerData.provider;

      const response = await fetch(`${BASE_URL}/api/tour-guide/provider/${provider._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 404) {
        // Create new tour guide if not exists
        const createResponse = await fetch(`${BASE_URL}/api/tour-guide/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
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

        if (!createResponse.ok) throw new Error('Failed to create tour guide');
      }

      const guideData = await fetch(`${BASE_URL}/api/tour-guide/provider/${provider._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json());

      setTourGuide(guideData);

      // Fetch tour packages
      const packagesData = await fetch(`${BASE_URL}/api/tour-guide/${guideData._id}/tour-packages`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json());
      setTourPackages(packagesData);

      // Fetch reviews
      const reviewsData = await fetch(`${BASE_URL}/api/tour-guide/${guideData._id}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json());
      setReviews(reviewsData.reviews || []);
      setAverageRating(reviewsData.averageRating || 0);

      // Fetch bookings using correct backend route
      const bookingsResponse = await fetch(`${BASE_URL}/api/tour-guide/${guideData._id}/tour-guide-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let bookingsData = [];
      if (bookingsResponse.ok) {
        bookingsData = await bookingsResponse.json();
      }
      setTourBookings(bookingsData || []);

      setFormData({
        name: guideData.name || '',
        bio: guideData.bio || '',
        location: guideData.location || '',
        languages: guideData.languages || [],
        yearsOfExperience: guideData.yearsOfExperience || 0,
        certification: guideData.certification || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL, navigate]);

  useEffect(() => {
    fetchTourGuideData();
  }, [fetchTourGuideData]);

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('providerToken');
      const response = await fetch(`${BASE_URL}/api/tour-bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setTourBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId ? { ...booking, status: newStatus } : booking
          )
        );
        toast.success(`Booking ${newStatus} successfully!`);
      } else {
        throw new Error('Failed to update booking status');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePublish = async (packageId) => {
    setError('');
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('No token found. Please log in again.');
        setTimeout(() => navigate('/service-provider/login'), 2000);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/tour-guide/tour-package/${packageId}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('No token found. Please log in again.');
        setTimeout(() => navigate('/service-provider/login'), 2000);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/tour-guide/tour-package/${packageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
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
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('No token found. Please log in again.');
        setTimeout(() => navigate('/service-provider/login'), 2000);
        return;
      }

      const formData = new FormData();
      formData.append('tourGuideId', tourGuide._id);
      formData.append('profilePicture', profilePictureFile);
      const response = await fetch(`${BASE_URL}/api/tour-guide/update-profile-picture`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
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

  const handleUpdateBanner = async () => {
    if (!bannerFile) {
      setError('Please select a banner file');
      return;
    }
    setError('');
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('No token found. Please log in again.');
        setTimeout(() => navigate('/service-provider/login'), 2000);
        return;
      }

      const formData = new FormData();
      formData.append('tourGuideId', tourGuide._id);
      formData.append('banner', bannerFile);
      const response = await fetch(`${BASE_URL}/api/tour-guide/update-banner`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
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
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('No token found. Please log in again.');
        setTimeout(() => navigate('/service-provider/login'), 2000);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/tour-guide/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tourGuideId: tourGuide._id,
          ...formData,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTourGuide({ ...tourGuide, ...formData });
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
    localStorage.removeItem('provider');
    toast.success('Logged out successfully!');
    setTimeout(() => navigate('/service-provider/login', { replace: true }), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      <TourGuideHeader />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover />
      
      <div className="flex-grow container mx-auto p-6 md:p-10 mt-20 mb-12">
        {error && (
          <p className="text-red-600 text-center mb-6 font-medium bg-red-100 py-3 rounded-lg">{error}</p>
        )}
        
        {isLoading ? (
          <div className="text-center">
            <p className="text-gray-600 text-lg">Loading...</p>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-green-500 h-12 w-12 mx-auto mt-4 animate-spin"></div>
          </div>
        ) : tourGuide ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 md:col-span-3 lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-lg text-left ${
                      activeTab === 'overview'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-4 py-2 rounded-lg text-left ${
                      activeTab === 'bookings'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Bookings
                  </button>
                  <button
                    onClick={() => setActiveTab('packages')}
                    className={`px-4 py-2 rounded-lg text-left ${
                      activeTab === 'packages'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Tour Packages
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-2 rounded-lg text-left ${
                      activeTab === 'reviews'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 rounded-lg text-left ${
                      activeTab === 'profile'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Profile Settings
                  </button>
<button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 mt-4"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
                    <div className="text-3xl font-bold text-green-600">{tourBookings.length}</div>
                    <p className="text-gray-600">Total Bookings</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Tour Packages</h3>
                    <div className="text-3xl font-bold text-blue-600">{tourPackages.length}</div>
                    <p className="text-gray-600">Active Packages</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Rating</h3>
                    <div className="text-3xl font-bold text-yellow-600">{averageRating.toFixed(1)}/5.0</div>
                    <p className="text-gray-600">{reviews.length} Reviews</p>
                  </div>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Tour Bookings</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tourist</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tourBookings.map((booking) => (
                          <tr key={booking._id}>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{booking.email}</div>
                              <div className="text-sm text-gray-500">{booking.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{booking.packageId?.title || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{booking.travelersCount} travelers</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {new Date(booking.travelDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                                  booking.status === 'cancelled' ? 'bg-gray-200 text-gray-600' :
                                  booking.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                                  booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  'bg-gray-100 text-gray-800'}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {booking.status === 'pending' && (
                                <div className="space-x-2">
                                  <button
                                    onClick={() => handleBookingStatusUpdate(booking._id, 'approved')}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleBookingStatusUpdate(booking._id, 'rejected')}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Packages Tab */}
              {activeTab === 'packages' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Tour Packages</h2>
                    {tourGuide.verificationStatus === 'verified' && (
                      <Link
                        to="/tour-guide/create-package"
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600"
                      >
                        Create New Package
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tourPackages.map((pkg) => (
                      <div key={pkg._id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                        <p className="text-gray-600 mb-2">{pkg.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                          <span>Price: ${pkg.price}</span>
                          <span>Duration: {pkg.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${pkg.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {pkg.status}
                          </span>
                          <div className="space-x-2">
                            {pkg.status === 'draft' && (
                              <button
                                onClick={() => handlePublish(pkg._id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                Publish
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(pkg._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-2">
                          <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                            {review.touristId?.username?.[0]?.toUpperCase() || 'A'}
                          </div>
                          <div>
                            <h4 className="font-medium">{review.touristId?.username || 'Anonymous'}</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Settings Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
                      <div className="mb-4">
                        <img
                          src={tourGuide.profilePicture ? `${BASE_URL}${tourGuide.profilePicture}` : 'https://via.placeholder.com/150'}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      </div>
                      <input
                        type="file"
                        onChange={(e) => setProfilePictureFile(e.target.files[0])}
                        className="hidden"
                        id="profile-picture"
                      />
                      <label
                        htmlFor="profile-picture"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
                      >
                        Choose New Picture
                      </label>
                      {profilePictureFile && (
                        <button
                          onClick={handleUpdateProfilePicture}
                          className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Banner Image</h3>
                      <div className="mb-4">
                        <img
                          src={tourGuide.banner ? `${BASE_URL}${tourGuide.banner}` : 'https://via.placeholder.com/800x200'}
                          alt="Banner"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <input
                        type="file"
                        onChange={(e) => setBannerFile(e.target.files[0])}
                        className="hidden"
                        id="banner-image"
                      />
                      <label
                        htmlFor="banner-image"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
                      >
                        Choose New Banner
                      </label>
                      {bannerFile && (
                        <button
                          onClick={handleUpdateBanner}
                          className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages.join(', ')}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="English, Spanish, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Certification</label>
                      <input
                        type="text"
                        name="certification"
                        value={formData.certification}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-teal-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              )}
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