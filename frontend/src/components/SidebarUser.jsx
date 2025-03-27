import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  FaHome,
  FaGlobe,
  FaBook,
  FaUserEdit,
  FaCog,
  FaHotel,
  FaCar,
  FaUserFriends,
  FaSuitcase,
  FaInfoCircle,
  FaSignOutAlt,
} from 'react-icons/fa';

// Backend base URL (adjust this based on your backend URL)
const BACKEND_URL = 'http://localhost:5000';

const SidebarUser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')) || {});

  // Listen for changes in localStorage to update the profile picture
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user')) || {};
      setUserData(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check for changes in the same tab
    const interval = setInterval(() => {
      const updatedUser = JSON.parse(localStorage.getItem('user')) || {};
      if (JSON.stringify(updatedUser) !== JSON.stringify(userData)) {
        setUserData(updatedUser);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [userData]);

  const username = userData.username || 'Guest';
  const profilePicture = userData.profilePicture
    ? userData.profilePicture.startsWith('http')
      ? userData.profilePicture
      : `${BACKEND_URL}${userData.profilePicture}`
    : 'https://via.placeholder.com/150'; // Fallback to placeholder

  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg flex flex-col">
      {/* Header Section */}
      <div className="p-6">
        <div className="mt-6 flex items-center group">
          <div className="w-12 h-12 rounded-full mr-3 flex items-center justify-center transition-transform group-hover:scale-105">
            <img
              src={profilePicture}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold group-hover:text-blue-300 transition-colors">{username}</p>
            <p className="text-xs text-gray-400">Traveler</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        <ul>
          <li className="mb-2">
            <NavLink
              to="/user/dashboard"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                }`
              }
            >
              <FaHome className="mr-3" /> Dashboard
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/user/explore"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                }`
              }
            >
              <FaGlobe className="mr-3" /> Explore Destinations
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/user/my-booking"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                }`
              }
            >
              <FaBook className="mr-3" /> My Booking
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/user/edit-profile"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                }`
              }
            >
              <FaUserEdit className="mr-3" /> Edit Profile
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/user/account-settings"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                }`
              }
            >
              <FaCog className="mr-3" /> Account Settings
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/user/hotels"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                }`
              }
            >
              <FaHotel className="mr-3" /> Hotel Booking
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/user/vehicles"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                }`
              }
            >
              <FaCar className="mr-3" /> Vehicle Rental
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/user/guides"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                }`
              }
            >
              <FaUserFriends className="mr-3" /> Tour Guides
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/user/packages"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                }`
              }
            >
              <FaSuitcase className="mr-3" /> Travel Packages
            </NavLink>
          </li>
          <li className="mb-2">
            <NavLink
              to="/user/about"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                }`
              }
            >
              <FaInfoCircle className="mr-3" /> About Us
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Sign Out Button */}
      <div className="p-4">
        <button
          onClick={handleSignOut}
          className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-red-600/50 hover:text-white transition-all duration-300 w-full text-left"
        >
          <FaSignOutAlt className="mr-3" /> Sign Out
        </button>
      </div>
    </div>
  );
};

export default SidebarUser;