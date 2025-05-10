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
  FaSignOutAlt,
  FaBars,
  FaChevronLeft
} from 'react-icons/fa';
import { SidebarUserContext } from './SidebarUserContext';

const BACKEND_URL = 'http://localhost:5000';

const SidebarUser = ({ children }) => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user')) || {});
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedUser = JSON.parse(localStorage.getItem('user')) || {};
      setUserData(updatedUser);
    };

    window.addEventListener('storage', handleStorageChange);
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

  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', collapsed ? '5rem' : '16rem');
  }, [collapsed]);

  const username = userData.username || 'Guest';
  const profilePicture = userData.profilePicture
    ? userData.profilePicture.startsWith('http')
      ? userData.profilePicture
      : `${BACKEND_URL}${userData.profilePicture}`
    : 'https://via.placeholder.com/150';

  const handleSignOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <SidebarUserContext.Provider value={{ collapsed }}>
      <div className={`fixed top-0 left-0 ${collapsed ? 'w-20' : 'w-64'} h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-lg flex flex-col z-40 transition-all duration-300`}>
        {/* Collapse/Expand Button */}
        <button
          className="absolute top-4 right-2 bg-blue-700 hover:bg-blue-800 text-white rounded-full p-2 z-50 focus:outline-none transition-all"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FaBars /> : <FaChevronLeft />}
        </button>
        {/* Header Section */}
        <div className={`p-6 flex-shrink-0 ${collapsed ? 'flex flex-col items-center' : ''}`}>
          <div className="mt-6 flex items-center group">
            <div className={`rounded-full mr-3 flex items-center justify-center transition-transform group-hover:scale-105 ${collapsed ? 'w-10 h-10' : 'w-12 h-12'}`}>
              <img
                src={profilePicture}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border-2 border-blue-600"
              />
            </div>
            {!collapsed && (
              <div>
                <p className="text-sm font-semibold group-hover:text-blue-400 transition-colors">{username}</p>
                <p className="text-xs text-gray-400">Traveler</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-2 overflow-y-auto custom-scrollbar">
          <ul>
            <li className="mb-2">
              <NavLink
                to="/user/dashboard"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-700/50 hover:text-white transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                  }`
                }
              >
                <FaHome className="mr-3" /> {!collapsed && 'Dashboard'}
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/user/reviews"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-700/50 hover:text-white transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                  }`
                }
              >
                <FaBook className="mr-3" /> {!collapsed && 'Reviews'}
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/user/explore"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-700/50 hover:text-white transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                  }`
                }
              >
                <FaGlobe className="mr-3" /> {!collapsed && 'Explore Destinations'}
              </NavLink>
            </li>
            {/* My Booking Section with Sub-Items */}
            <li className="mb-2">
              <div className={`flex items-center p-3 rounded-lg text-gray-300 bg-blue-900/60 font-semibold ${collapsed ? 'justify-center' : ''}`}>
                <FaBook className="mr-3" /> {!collapsed && 'My Booking'}
              </div>
              <ul className={`ml-${collapsed ? '0' : '8'} mt-1 space-y-1`}>
                <li>
                  <NavLink
                    to="/user/my-booking/hotels"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg text-gray-300 hover:bg-blue-700/50 hover:text-white transition-all duration-300 ${
                        isActive ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white' : ''
                      }`
                    }
                  >
                    <FaHotel className="mr-2" /> {!collapsed && 'Hotel Bookings'}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user/my-booking/tour-guides"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg text-gray-300 hover:bg-blue-700/50 hover:text-white transition-all duration-300 ${
                        isActive ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white' : ''
                      }`
                    }
                  >
                    <FaUserFriends className="mr-2" /> {!collapsed && 'Tour Guide Bookings'}
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/user/my-booking/vehicles"
                    className={({ isActive }) =>
                      `flex items-center p-2 rounded-lg text-gray-300 hover:bg-blue-700/50 hover:text-white transition-all duration-300 ${
                        isActive ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white' : ''
                      }`
                    }
                  >
                    <FaCar className="mr-2" /> {!collapsed && 'Vehicle Bookings'}
                  </NavLink>
                </li>
              </ul>
            </li>
            <li className="mb-2">
              <NavLink
                to="/user/edit-profile"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-700/50 hover:text-white transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                  }`
                }
              >
                <FaUserEdit className="mr-3" /> {!collapsed && 'Edit Profile'}
              </NavLink>
            </li>
            <li className="mb-2">
              <NavLink
                to="/user/account-settings"
                className={({ isActive }) =>
                  `flex items-center p-3 rounded-lg text-gray-300 hover:bg-blue-700/50 hover:text-white transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-r from-blue-600 to-blue-800 text-white' : ''
                  }`
                }
              >
                <FaCog className="mr-3" /> {!collapsed && 'Account Settings'}
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Sign Out Button */}
        <div className="p-4 flex-shrink-0">
          <button
            onClick={handleSignOut}
            className="flex items-center p-3 rounded-lg text-gray-300 hover:bg-red-600/50 hover:text-white transition-all duration-300 w-full text-left"
          >
            <FaSignOutAlt className="mr-3" /> {!collapsed && 'Sign Out'}
          </button>
        </div>
      </div>
      {children}
    </SidebarUserContext.Provider>
  );
};

export default SidebarUser;