import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-lg rounded-xl py-4 px-6 flex justify-between items-center z-10">
      {/* Logo */}
      <div className="flex items-center space-x-2">
        <Link to="/" className="bg-blue-600 text-white text-xl font-bold px-4 py-2 rounded-full shadow-md">
          TraviGo
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex space-x-8">
        <Link
          to="/"
          className="text-gray-300 text-lg font-medium hover:text-blue-400 transition-colors duration-200"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-gray-300 text-lg font-medium hover:text-blue-400 transition-colors duration-200"
        >
          About
        </Link>
        <Link
          to="/services"
          className="text-gray-300 text-lg font-medium hover:text-blue-400 transition-colors duration-200"
        >
          Services
        </Link>
        <Link
          to="/contact"
          className="text-gray-300 text-lg font-medium hover:text-blue-400 transition-colors duration-200"
        >
          Contact
        </Link>
      </div>

      {/* Auth Buttons */}
      <div className="flex space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-5 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors duration-200 shadow-md">
          Login
        </Link>
        <Link to="/signin" className="bg-gray-800 text-blue-400 border-2 border-blue-600 px-5 py-2 rounded-full font-semibold hover:bg-gray-700 hover:text-blue-300 transition-colors duration-200 shadow-md">
          Register
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button className="text-gray-300 hover:text-blue-400 focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;