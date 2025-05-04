import React, { useRef, useEffect, useState } from "react";
import HotelItem from "../components/HotelItem";
import SearchBar from "../components/SearchBar";
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
          className="relative w-full h-[400px] bg-cover bg-center"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1542314831-8d7e2b9b6b9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Find Your Perfect Stay</h1>
            <p className="text-lg text-white mb-6">Explore the best hotels with unbeatable prices</p>
            <div className="w-full max-w-md">
              <SearchBar />
            </div>
          </div>
        </div>

        {/* Hotel Listings */}
        <div className="w-[90%] max-w-screen-xl mx-auto py-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Featured Hotels</h2>
          {hotels.length === 0 ? (
            <p className="text-center text-gray-600">No hotels available at the moment.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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