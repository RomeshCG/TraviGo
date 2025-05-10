import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; // Ensure this path is correct

function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false); // State for Services dropdown

  // Handle scroll event to adjust header position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50); // Change position after 50px scroll
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleServices = () => {
    setIsServicesOpen(!isServicesOpen);
  };

  return (
    <header
      className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "top-5 left-20 right-20 bg-white/80 backdrop-blur-md shadow-lg" : "top-16 bg-transparent"
      } rounded-xl border-b border-[rgba(255,255,255,0.2)]`}
      style={{
        background: isScrolled ? "bg-white/20 shadow-lg backdrop-blur-md" : "bg-transparent",
      }}
    >
      <div className="container mx-auto px-6 lg:px-12 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src={logo}
              alt="TraviGo Logo"
              className="w-auto h-16 lg:h-20 transition-all duration-300 hover:scale-105" // Increased size
            />
          </Link>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="lg:hidden p-2 text-[#203c8c] transition-all duration-300 rounded-full bg-gray-800/50 hover:bg-blue-700 focus:outline-none"
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
            <Link to="/" className="text-[#203c8c] font-semibold text-lg hover:text-[#1a2f6e] transition-all duration-300">Home</Link>
            <Link to="/about" className="text-[#203c8c] font-semibold text-lg hover:text-[#1a2f6e] transition-all duration-300">About</Link>
            {/* Services Dropdown */}
            <div className="relative">
              <button
                onClick={toggleServices}
                className="text-[#203c8c] font-semibold text-lg hover:text-[#1a2f6e] transition-all duration-300 flex items-center"
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
                <div className="absolute left-0 mt-2 w-48 bg-white/90 backdrop-blur-md rounded-lg shadow-lg p-2">
                  <Link
                    to="/services/hotel-listings"
                    className="block py-2 px-4 text-[#203c8c] hover:text-[#1a2f6e] transition-all duration-300"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Hotel Listings
                  </Link>
                  <Link
                    to="/services/tour-guides"
                    className="block py-2 px-4 text-[#203c8c] hover:text-[#1a2f6e] transition-all duration-300"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Tour Guides
                  </Link>
                  <Link
                    to="/services/vehicle-listings"
                    className="block py-2 px-4 text-[#203c8c] hover:text-[#1a2f6e] transition-all duration-300"
                    onClick={() => setIsServicesOpen(false)}
                  >
                    Vehicle Listings
                  </Link>
                </div>
              )}
            </div>
            <Link to="/contact" className="text-[#203c8c] font-semibold text-lg hover:text-[#1a2f6e] transition-all duration-300">Contact</Link>
          </div>

          {/* Login and Register Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/login" className="bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-[#1a2f6e] transition-all duration-300 shadow-md hover:shadow-lg">Login</Link>
            <Link to="/signin" className="bg-green-600 text-white px-6 py-3 rounded-full font-medium hover:bg-[#146b3a] transition-all duration-300 shadow-md hover:shadow-lg">Register</Link>
          </div>

          {/* Mobile Menu */}
          <div className={`${isMenuOpen ? "block" : "hidden"} lg:hidden absolute top-16 right-4 w-48 bg-white/90 backdrop-blur-md rounded-lg p-4 shadow-lg`}>
            <Link to="/" className="block py-2 text-[#203c8c] font-medium hover:text-[#1a2f6e] transition-all duration-300" onClick={toggleMenu}>Home</Link>
            <Link to="/about" className="block py-2 text-[#203c8c] font-medium hover:text-[#1a2f6e] transition-all duration-300" onClick={toggleMenu}>About</Link>
            <Link to="/services/hotel-listings" className="block py-2 text-[#203c8c] font-medium hover:text-[#1a2f6e] transition-all duration-300" onClick={toggleMenu}>Hotel Listings</Link>
            <Link to="/services/tour-guides" className="block py-2 text-[#203c8c] font-medium hover:text-[#1a2f6e] transition-all duration-300" onClick={toggleMenu}>Tour Guides</Link>
            <Link to="/services/vehicle-listings" className="block py-2 text-[#203c8c] font-medium hover:text-[#1a2f6e] transition-all duration-300" onClick={toggleMenu}>Vehicle Listings</Link>
            <Link to="/contact" className="block py-2 text-[#203c8c] font-medium hover:text-[#1a2f6e] transition-all duration-300" onClick={toggleMenu}>Contact</Link>
            <div className="mt-4 flex flex-col space-y-2">
              <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-full font-medium hover:bg-[#1a2f6e] transition-all duration-300" onClick={toggleMenu}>Login</Link>
              <Link to="/signin" className="bg-green-600 text-white px-4 py-2 rounded-full font-medium hover:bg-[#146b3a] transition-all duration-300" onClick={toggleMenu}>Register</Link>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;