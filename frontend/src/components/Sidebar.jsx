import React from 'react';
import { NavLink } from 'react-router-dom';
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

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg flex flex-col">
      {/* Header Section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold flex items-center tracking-wide">
          <span className="mr-2 text-blue-400">🌍</span> TraviGo
        </h2>
        <div className="mt-6 flex items-center group">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-700 rounded-full mr-3 flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-xl font-semibold">JD</span>
          </div>
          <div>
            <p className="text-sm font-semibold group-hover:text-blue-300 transition-colors">John Doe</p>
            <p className="text-xs text-gray-400">Traveler</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        <ul>
          <li className="mb-2">
            <NavLink
              to="/"
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
          <li className="mb-2">
            <NavLink
              to="/about"
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
        <NavLink
          to="/sign-out"
          className={({ isActive }) =>
            `flex items-center p-3 rounded-lg text-gray-300 hover:bg-red-600/50 hover:text-white transition-all duration-300 ${
              isActive ? 'bg-red-600 text-white' : ''
            }`
          }
        >
          <FaSignOutAlt className="mr-3" /> Sign Out
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;