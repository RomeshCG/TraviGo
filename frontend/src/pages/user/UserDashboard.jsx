import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserEdit, FaHotel, FaCar, FaMapMarkedAlt, FaStar } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import SidebarUser from "../../components/SidebarUser";
import HeaderUser from "../../components/HeaderUser";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BACKEND_URL = 'http://localhost:5000';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [userReviews, setUserReviews] = useState([]);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [travelStats, setTravelStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser._id) {
          throw new Error('User not found in local storage');
        }

        const response = await fetch(`/api/user/${storedUser._id}`);
        const data = await response.json();

        if (response.ok) {
          if (data.profilePicture && !data.profilePicture.startsWith('http')) {
            data.profilePicture = `${BACKEND_URL}${data.profilePicture}`;
          }
          setUser(data);
          storedUser.profilePicture = data.profilePicture;
          localStorage.setItem('user', JSON.stringify(storedUser));
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Fetch reviews received by the user
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser._id) {
      fetch(`http://localhost:5000/api/user/${storedUser._id}/reviews`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data.reviews)) setUserReviews(data.reviews);
        });
    }

    // Fetch travel statistics (real data)
    const fetchTravelStats = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;
      try {
        const res = await fetch('/api/user/booking-stats/monthly', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok && data.stats) {
          setTravelStats(data.stats);
        }
      } catch { /* ignore error */ }
    };
    fetchTravelStats();
  }, []);

  const handleProfilePictureUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('userId', user._id);
    formData.append('profilePicture', file);

    setUploadLoading(true);
    setUploadError('');

    try {
      const response = await fetch('/api/user/update-profile-picture', {
        method: 'PUT',
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        if (data.user.profilePicture && !data.user.profilePicture.startsWith('http')) {
          data.user.profilePicture = `${BACKEND_URL}${data.user.profilePicture}`;
        }
        setUser(data.user);
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.profilePicture = data.user.profilePicture;
        localStorage.setItem('user', JSON.stringify(storedUser));
        window.location.reload();
      } else {
        throw new Error(data.message || 'Failed to upload profile picture');
      }
    } catch (err) {
      setUploadError(err.message || 'An error occurred while uploading the profile picture');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleEditProfile = () => {
    navigate('/edit-profile');
  };

  // Calculate review ratings distribution for chart
  const reviewRatings = [1, 2, 3, 4, 5].map(star =>
    userReviews.filter(r => r.rating === star).length
  );
  const reviewChartData = {
    labels: ['1★', '2★', '3★', '4★', '5★'],
    datasets: [
      {
        label: 'Number of Reviews',
        data: reviewRatings,
        backgroundColor: [
          '#64748b', // slate-500
          '#475569', // slate-700
          '#2563eb', // blue-600
          '#0ea5e9', // sky-500
          '#22d3ee', // cyan-400
        ],
        borderRadius: 6,
      },
    ],
  };
  const reviewChartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  // Travel statistics data for chart (real data if available)
  const travelStatsOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

  let travelStatsData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Hotel Bookings',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#2563eb',
        borderRadius: 6,
      },
      {
        label: 'Tour Bookings',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#0ea5e9',
        borderRadius: 6,
      },
      {
        label: 'Vehicle Bookings',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: '#64748b',
        borderRadius: 6,
      },
    ],
  };

  // Only use travelStats if it's a valid array of 12 objects with numbers
  const isValidStats = Array.isArray(travelStats) && travelStats.length === 12 && travelStats.every(s => s && typeof s.hotel === 'number' && typeof s.tour === 'number');
  if (isValidStats) {
    travelStatsData = {
      labels: travelStats.map((_, idx) => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][idx]),
      datasets: [
        {
          label: 'Hotel Bookings',
          data: travelStats.map(s => s.hotel),
          backgroundColor: '#2563eb',
          borderRadius: 6,
        },
        {
          label: 'Tour Bookings',
          data: travelStats.map(s => s.tour),
          backgroundColor: '#0ea5e9',
          borderRadius: 6,
        },
        {
          label: 'Vehicle Bookings',
          data: Array(12).fill(0),
          backgroundColor: '#64748b',
          borderRadius: 6,
        },
      ],
    };
  }

  if (loading) {
    return (
      <div className="flex">
        <SidebarUser />
        <div className="flex-1">
          <HeaderUser />
          <div className="p-6 md:p-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex">
        <SidebarUser />
        <div className="flex-1">
          <HeaderUser />
          <div className="p-6 md:p-10 bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SidebarUser />
      <div style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
        <div className="flex-1">
          <HeaderUser />
          <div className="p-6 md:p-10 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen">
            {/* Header Section */}
            <div className="mb-10 flex items-center gap-4">
              <h1 className="text-4xl font-extrabold text-blue-800 tracking-tight drop-shadow-lg">Welcome, {user.username}!</h1>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Profile and Reviews */}
              <div className="space-y-6">
                {/* Profile Card */}
                <div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100 hover:shadow-blue-200 transition-shadow duration-300">
                  <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <FaUserEdit className="text-blue-400" /> Profile
                  </h2>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="relative">
                      <img
                        src={user.profilePicture}
                        alt="Profile"
                        className="w-20 h-20 rounded-full object-cover border-4 border-blue-300 shadow-md"
                      />
                      <label
                        htmlFor="profile-picture-upload"
                        className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-all border-2 border-white shadow"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z"
                          />
                        </svg>
                      </label>
                      <input
                        id="profile-picture-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                    </div>
                    <div>
                      <p className="text-gray-700 font-medium">
                        <span className="font-semibold">Email:</span> {user.email}
                      </p>
                      <p className="text-gray-700 font-medium">
                        <span className="font-semibold">Phone:</span> {user.phoneNumber}
                      </p>
                      <p className="text-gray-700 font-medium">
                        <span className="font-semibold">Country:</span> {user.country}
                      </p>
                    </div>
                  </div>
                  {uploadLoading && <p className="text-gray-600">Uploading...</p>}
                  {uploadError && <p className="text-red-500">{uploadError}</p>}
                  <button
                    onClick={handleEditProfile}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md font-semibold mt-2"
                  >
                    Edit Profile
                  </button>
                </div>

                {/* Reviews Received Section */}
                <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-50">
                  <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <FaStar className="text-yellow-400" /> Reviews Received
                  </h2>
                  {userReviews.length === 0 ? (
                    <p className="text-gray-600">No reviews received yet.</p>
                  ) : (
                    <>
                      {/* Chart for review ratings distribution */}
                      <div className="mb-4 flex justify-center">
                        <div style={{ width: 260 }}>
                          <Bar data={reviewChartData} options={reviewChartOptions} height={180} />
                        </div>
                      </div>
                      {/* Show most recent review */}
                      <div className="border rounded-xl p-4 mb-2 bg-gradient-to-r from-yellow-50 to-white shadow-sm">
                        <div className="flex items-center mb-2 gap-2">
                          <span className="font-bold text-green-700 mr-2">Guide:</span>
                          <span>{userReviews[0].tourGuideId?.name || 'Tour Guide'}</span>
                          <span className="ml-4 flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar key={i} className={i < userReviews[0].rating ? 'text-yellow-400' : 'text-gray-300'} />
                            ))}
                          </span>
                        </div>
                        <div className="text-gray-700 italic">"{userReviews[0].comment}"</div>
                        <div className="text-xs text-gray-400 mt-1">{new Date(userReviews[0].createdAt).toLocaleDateString()}</div>
                      </div>
                      {userReviews.length > 1 && (
                        <button
                          className="text-blue-600 hover:underline text-sm mb-2"
                          onClick={() => setShowAllReviews(true)}
                        >
                          Show All Reviews
                        </button>
                      )}
                      {/* Modal or expandable section for all reviews */}
                      {showAllReviews && (
                        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(30, 41, 59, 0.15)", backdropFilter: "blur(2px)" }}>
                          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full max-h-[80vh] overflow-y-auto relative border-2 border-blue-200">
                            <button
                              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl"
                              onClick={() => setShowAllReviews(false)}
                            >
                              &times;
                            </button>
                            <h3 className="text-xl font-bold mb-4 text-blue-700 flex items-center gap-2"><FaStar className="text-yellow-400" /> All Reviews</h3>
                            <div className="space-y-4">
                              {userReviews.map((review) => (
                                <div key={review._id} className="border rounded-xl p-4 bg-gradient-to-r from-yellow-50 to-white shadow-sm">
                                  <div className="flex items-center mb-2 gap-2">
                                    <span className="font-bold text-green-700 mr-2">Guide:</span>
                                    <span>{review.tourGuideId?.name || 'Tour Guide'}</span>
                                    <span className="ml-4 flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'} />
                                      ))}
                                    </span>
                                  </div>
                                  <div className="text-gray-700 italic">"{review.comment}"</div>
                                  <div className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Right Column: Travel Statistics */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100">
                  <h2 className="text-2xl font-bold text-blue-700 mb-4 flex items-center gap-2">
                    <FaMapMarkedAlt className="text-blue-400" /> Travel Statistics
                  </h2>
                  <div className="mb-4 flex justify-center">
                    <div style={{ width: 400 }}>
                      {isValidStats ? (
                        <Bar data={travelStatsData} options={travelStatsOptions} height={180} />
                      ) : (
                        <div className="text-gray-500 text-center">Travel statistics are not available at the moment.</div>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-600">
                    {userReviews.length === 0 ? 'No activity yet.' : 'Your travel statistics for the year are shown above.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;