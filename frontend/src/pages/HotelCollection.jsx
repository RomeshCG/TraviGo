import React, { useRef, useEffect, useState } from "react";
import HotelItem from "../components/HotelItem";
import SearchBar from "../components/SearchBar";

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
    <div
      className="flex flex-col items-center w-full min-h-screen bg-gradient-to-b from-blue-100 via-blue-300 to-blue-500"
      style={{
        backgroundImage:
          "radial-gradient(circle at center, rgba(255, 255, 255, 0.3) 0%, rgba(59, 130, 246, 0.2) 70%, rgba(29, 78, 216, 0.1) 100%)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div
        className="w-[90%] max-w-screen-xl mt-8 flex flex-col items-center"
        style={{
          paddingTop: `${headerHeight + mobileMenuHeight + 16}px`,
        }}
      >
        <div className="w-full flex justify-center mt-15 mb-6">
          <SearchBar />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-10">
          {hotels.map((hotel) => (
            <HotelItem key={hotel._id} hotel={hotel} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotelCollection;