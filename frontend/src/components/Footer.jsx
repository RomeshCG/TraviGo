import React, { useState } from "react";
import MasterCard from "../assets/mastercard.png";
import VisaCard from "../assets/visa.png";
import PayHere from "../assets/payhere.png";
import { FaFacebookF, FaInstagram, FaTwitter, FaLinkedinIn } from "react-icons/fa";


const Footer = () => {
  // State for newsletter subscription
  const [email, setEmail] = useState("");

  // Handle newsletter subscription
  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed with email:", email);
    setEmail(""); // Reset input after submission
    alert("Thank you for subscribing to our newsletter!");
  };

  return (
    <footer className="bg-blue-900 text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">TraviGo</h3>
            <p className="text-gray-400">
              Your trusted travel companion, offering seamless booking and
              unforgettable experiences Sri Lanka.
            </p>
            <div className="mt-4">
              <p className="flex items-center text-gray-400">
                <span className="mr-2">📍</span> 10/A, Kandy, Sri Lanka
              </p>
              <p className="flex items-center text-gray-400">
                <span className="mr-2">📞</span> +94 81 249 0001
              </p>
              <p className="flex items-center text-gray-400">
                <span className="mr-2">✉️</span> contact@travigo.com
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/faq" className="text-gray-400 hover:text-white">
                  FAQs
                </a>
              </li>
              <li>
                <a href="/blog" className="text-gray-400 hover:text-white">
                  Blog
                </a>
              </li>
              <li>
                <a href="/support" className="text-gray-400 hover:text-white">
                  Support
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-gray-400 hover:text-white">
                  Home
                </a>
              </li>
              <li>
                <a href="/about" className="text-gray-400 hover:text-white">
                  About
                </a>
              </li>
              <li>
                <a href="/services" className="text-gray-400 hover:text-white">
                  Services
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter and Service Provider Login */}
          <div>
            <h3 className="text-xl font-bold mb-4">Stay Connected</h3>
            {/* Newsletter Subscription */}
            <form onSubmit={handleSubscribe} className="mb-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 rounded-lg mb-2 text-white border border-white"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Subscribe
              </button>
            </form>
            {/* Service Provider Login */}
            <a
              href="/service-provider-login"
              className="block bg-gray-800 text-white p-2 rounded-lg text-center hover:bg-gray-700 transition duration-300"
            >
              Service Provider Login
            </a>
          </div>
        </div>

        {/* Social Media and Payment Methods */}
        <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center">
          {/* Social Media Links */}
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="https://facebook.com" className="text-gray-400 hover:text-white">
            <FaFacebookF /> 
            </a>
            <a href="https://instagram.com" className="text-gray-400 hover:text-white">
              <FaInstagram/>
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-white">
            <FaTwitter/>
            </a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-white">
            <FaLinkedinIn/>
            </a>
          </div>

          {/* Payment Methods */}
          <div className="flex space-x-4">
            <img
              src={VisaCard}
              alt="Visa"
              className="h-8"
            />
            <img
              src={MasterCard}
              alt="MasterCard"
              className="h-8"
            />
            <img
              src={PayHere}
              alt="PayHere"
              className="h-8"
            />
          </div>
        </div>

        {/* Privacy, Terms, and Copyright */}
        <div className="mt-6 text-center text-gray-400">
          <div className="space-x-4 mb-2">
            <a href="/privacy-policy" className="hover:text-white">
              Privacy Policy
            </a>
            <a href="/terms-conditions" className="hover:text-white">
              Terms & Conditions
            </a>
          </div>
          <p>&copy; 2025 TraviGo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;