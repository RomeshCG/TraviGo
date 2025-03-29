import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SidebarUser from "../../components/SidebarUser";
import HeaderUser from "../../components/HeaderUser";

// Backend base URL (adjust this based on your backend URL)
const BACKEND_URL = 'http://localhost:5000';

function UserDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the user data from localStorage (set during login)
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser._id) {
          throw new Error('User not found in local storage');
        }

        // Fetch user data from the backend
        const response = await fetch(`/api/user/${storedUser._id}`);
        const data = await response.json();

        if (response.ok) {
          // Prepend the backend URL to the profile picture
          if (data.profilePicture && !data.profilePicture.startsWith('http')) {
            data.profilePicture = `${BACKEND_URL}${data.profilePicture}`;
          }
          setUser(data);
          // Update localStorage with the full profile picture URL
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
        // Prepend the backend URL to the new profile picture
        if (data.user.profilePicture && !data.user.profilePicture.startsWith('http')) {
          data.user.profilePicture = `${BACKEND_URL}${data.user.profilePicture}`;
        }
        // Update the user state with the new profile picture
        setUser(data.user);
        // Update localStorage to reflect the new profile picture
        const storedUser = JSON.parse(localStorage.getItem('user'));
        storedUser.profilePicture = data.user.profilePicture;
        localStorage.setItem('user', JSON.stringify(storedUser));
        // Force a re-fetch to ensure consistency
        window.location.reload(); // Temporary solution to force re-render of SidebarUser
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

  if (loading) {
    return (
      <div className="flex">
        <SidebarUser />
        <div className="flex-1">
          <HeaderUser />
          <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
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
          <div className="p-6 bg-gray-100 min-h-screen flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <SidebarUser />
      <div className="flex-1">
        <HeaderUser />
        <div className="p-6 bg-gray-100 min-h-screen">
          {/* Header Section */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">User Dashboard</h1>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Profile and Quick Actions */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Welcome back, {user.username}
                </h2>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <img
                      src={user.profilePicture}
                      alt="Profile"
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <label
                      htmlFor="profile-picture-upload"
                      className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600"
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
                    <p className="text-gray-600">
                      <span className="font-semibold">Email:</span> {user.email}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Phone:</span> {user.phoneNumber}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Country:</span> {user.country}
                    </p>
                  </div>
                </div>
                {uploadLoading && <p className="text-gray-600">Uploading...</p>}
                {uploadError && <p className="text-red-500">{uploadError}</p>}
                <button
                  onClick={handleEditProfile}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Edit Profile
                </button>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <button className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600">
                    Book a Hotel
                  </button>
                  <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">
                    Rent a Car
                  </button>
                  <button className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600">
                    Plan a Tour
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Placeholder for Future Features */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Travel Statistics
                </h2>
                <p className="text-gray-600">
                  No activity yet—feature coming soon! Our team is working on bringing you travel statistics.
                </p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                  Upcoming Trips
                </h2>
                <p className="text-gray-600">
                  No activity yet—feature coming soon! Booking and trip management features are under development.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;