import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"; 

function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={logo} alt="TraviGo Logo" className="h-12" />
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="text-white hover:text-blue-200 font-medium">
            Home
          </Link>
          <Link to="/about" className="text-white hover:text-blue-200 font-medium">
            About
          </Link>
          <Link to="/services" className="text-white hover:text-blue-200 font-medium">
            Services
          </Link>
          <Link to="/contact" className="text-white hover:text-blue-200 font-medium">
            Contact
          </Link>
        </nav>

        {/* Login and Register Buttons */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition duration-300"
          >
            Register
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;