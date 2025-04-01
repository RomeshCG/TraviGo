import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Ensure this path is correct

function SimpleHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false); // State for Services dropdown

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-6 lg:px-12 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="TraviGo Logo"
              className="w-auto h-12 lg:h-14"
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-[#203c8c] rounded-full bg-blue-600 hover:bg-blue-700 focus:outline-none"
            onClick={toggleMenu}
          >
            <svg
              className={`${isMenuOpen ? "hidden" : "block"} w-6 h-6`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
            <svg
              className={`${isMenuOpen ? "block" : "hidden"} w-6 h-6`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-[#203c8c] font-semibold text-lg hover:text-gray-500 transition-all duration-300">Home</Link>
            <Link to="/about" className="text-[#203c8c] font-semibold text-lg hover:text-gray-500 transition-all duration-300">About</Link>
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={toggleServices}
                className="text-[#203c8c] font-semibold text-lg hover:text-gray-500 transition-all duration-300 flex items-center"
              >
                Services
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {isServicesOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2">
                  <Link
                    to="/services/hotel-listings"
                    className="block py-2 px-4 text-[#203c8c] hover:text-gray-500 transition-all duration-300"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Hotel Listings
                  </Link>
                  <Link
                    to="/services/tour-guides"
                    className="block py-2 px-4 text-[#203c8c] hover:text-gray-500 transition-all duration-300"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Tour Guides
                  </Link>
                  <Link
                    to="/services/vehicle-listings"
                    className="block py-2 px-4 text-[#203c8c] hover:text-gray-500 transition-all duration-300"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Vehicle Listings
                  </Link>
                </div>
              )}
            </div>
            <Link to="/contact" className="text-[#203c8c] font-semibold text-lg hover:text-gray-500 transition-all duration-300">Contact</Link>
          </div>

          {/* Login and Register Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-all duration-300">Login</Link>
            <Link to="/signin" className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-green-700 transition-all duration-300">Register</Link>
          </div>

          {/* Mobile Menu */}
          <div className={`${isMenuOpen ? "block" : "hidden"} lg:hidden absolute top-16 right-4 w-48 bg-white rounded-lg p-4 shadow-lg`}>
            <Link to="/" className="block py-2 text-[#203c8c] font-medium hover:text-gray-500 transition-all duration-300" onClick={toggleMenu}>Home</Link>
            <Link to="/about" className="block py-2 text-[#203c8c] font-medium hover:text-gray-500 transition-all duration-300" onClick={toggleMenu}>About</Link>
            <Link to="/services/hotel-listings" className="block py-2 text-[#203c8c] font-medium hover:text-gray-500 transition-all duration-300" onClick={toggleMenu}>Hotel Listings</Link>
            <Link to="/services/tour-guides" className="block py-2 text-[#203c8c] font-medium hover:text-gray-500 transition-all duration-300" onClick={toggleMenu}>Tour Guides</Link>
            <Link to="/services/vehicle-listings" className="block py-2 text-[#203c8c] font-medium hover:text-gray-500 transition-all duration-300" onClick={toggleMenu}>Vehicle Listings</Link>
            <Link to="/contact" className="block py-2 text-[#203c8c] font-medium hover:text-gray-500 transition-all duration-300" onClick={toggleMenu}>Contact</Link>
            <div className="mt-4 flex flex-col space-y-2">
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-all duration-300" onClick={toggleMenu}>Login</Link>
              <Link to="/signin" className="bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-green-700 transition-all duration-300" onClick={toggleMenu}>Register</Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default SimpleHeader;