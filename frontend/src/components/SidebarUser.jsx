import React from 'react';
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

const SidebarUser = () => {
  const navigate = useNavigate();

  // Get the user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const username = user.username || 'Guest';
  const profilePicture = user.profilePicture || 'https://via.placeholder.com/150'; // Fallback to placeholder

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
              to="/explore"
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
              to="/my-booking"
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
              to="/edit-profile"
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
              to="/account-settings"
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
              to="/hotels"
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
              to="/vehicles"
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
              to="/guides"
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
              to="/packages"
              className={({ isActive }) =>
                `flex items-center p-3 rounded-lg text-gray-300 hover:bg-gray-700/50 hover:text-white transition-all duration-300 ${
                  isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                }`
              }
            >
              <FaSuitcase className="mr-3" /> Travel Packages
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