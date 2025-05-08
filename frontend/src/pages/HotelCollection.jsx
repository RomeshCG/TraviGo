import React, { useRef, useEffect, useState } from "react";
import HotelItem from "../components/HotelItem";
import SimpleHeader from "../components/SimpleHeader";
import Footer from "../components/Footer";

const HotelCollection = () => {
  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mobileMenuHeight, setMobileMenuHeight] = useState(0);
  const [hotels, setHotels] = useState([]);

  // Fetch hotels from backend
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("/api/hotels");
        const data = await response.json();
        setHotels(data);
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, []);

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  useEffect(() => {
    const mobileMenu = document.querySelector(".mobile-menu");
    if (mobileMenu && isMenuOpen) {
      setMobileMenuHeight(mobileMenu.offsetHeight);
    } else {
      setMobileMenuHeight(0);
    }
  }, [isMenuOpen]);

  return (
    <>
      <SimpleHeader />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div
          className="relative w-full h-[500px] bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542314831-8d7e2b9b6b9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50 flex flex-col items-center justify-center">
            <div className="text-center px-4">
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Discover Your Dream Stay
              </h1>
              <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                Experience luxury and comfort at our carefully curated selection of premium hotels
              </p>
              <div className="flex gap-4 justify-center">
                <button className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
                  Explore Hotels
                </button>
                <button className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                  View Deals
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Hotel Listings */}
        <div className="w-[90%] max-w-screen-xl mx-auto py-16">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Featured Hotels</h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          {hotels.length === 0 ? (
            <p className="text-center text-gray-600">No hotels available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {hotels.map((hotel) => (
                <HotelItem key={hotel._id} hotel={hotel} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HotelCollection;