import React, { useRef } from "react";
import Header from "../components/Header";
import ContactUs from "../components/ContactUsSmall"; 
import Footer from "../components/Footer";
import { FaArrowRight } from "react-icons/fa";
import backgroundImage from "../assets/TraviGoHero.jpg";
import HotelsImg from "../assets/Hotels.jpg";
import TourGuide from "../assets/Tour_Guide.jpg";
import CarRental from "../assets/Car_Rentals.jpg";
import poolImg from "../assets/Beach.jpg";
import beachImg from "../assets/Sigiriya.jpg";

function Home() {
  // Refs for different sections
  const hotelsRef = useRef(null);
  const vehiclesRef = useRef(null);
  const guidesRef = useRef(null);

  // Function to handle smooth scrolling
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="bg-gray-100">
      {/* Hero Section with Background Image */}
      <div className="relative min-h-screen bg-cover bg-center flex flex-col">
        {/* Fixed Header for Proper Alignment */}
        <div className="absolute top-0 left-0 w-full z-50 bg-opacity-90">
          <Header />
        </div>

        {/* Hero Background */}
        <div
          className="relative flex flex-col items-center justify-center flex-grow text-white text-center px-4"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <h1 className="text-6xl font-extrabold text-white animate-pulse">
  Discover Your Perfect Stay
</h1>


          <p className="text-xl mt-6 max-w-2xl leading-relaxed animate-fade-in">
            Where Your Dream Vacation Becomes a Reality. Customize your travel
            experience with our exclusive packages.
          </p>
          <button className="mt-8 bg-blue-600 px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition">
            More About <FaArrowRight className="ml-2 inline" />
          </button>
        </div>

       {/* Services Section with Clickable Cards */}
<div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-6 bg-white/60 p-4 rounded-lg shadow-lg backdrop-blur-md">
  {[
    {
      title: "Hotels",
      ref: hotelsRef,
      desc: "Find the best hotels for your stay.",
    },
    {
      title: "Vehicles",
      ref: vehiclesRef,
      desc: "Rent vehicles for your travel needs.",
    },
    {
      title: "Guides",
      ref: guidesRef,
      desc: "Hire experienced tour guides.",
    },
  ].map((service, index) => (
    <div
      key={index}
      className="p-4 text-center cursor-pointer hover:bg-gray-200 transition rounded-lg"
      onClick={() => scrollToSection(service.ref)}
    >
      <h3 className="text-2xl font-bold text-blue-600">{service.title}</h3>
      <p className="text-gray-700 mt-2">{service.desc}</p>
    </div>
  ))}
</div>

      </div>

      {/* Welcome Section */}
      <div className="bg-blue-100 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Left Section (Text - 35%) */}
            <div className="md:w-1/2 text-center md:text-left">
              <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent">
                Welcome to <span>TraviGo</span>
              </h2>
              <p className="mt-6 text-lg text-gray-800 leading-relaxed">
                Welcome to TraviGo, your ultimate travel companion for exploring
                the breathtaking beauty of Sri Lanka. At TraviGo, we believe that
                every journey should be as unique as the traveler. Whether you're
                planning a serene beach getaway, an adventurous trek through lush
                mountains, or a cultural exploration of ancient cities, we are
                here to make your travel dreams come true.

                <br /><br />Our platform offers a seamless experience, connecting
                you with the best hotels, reliable vehicle rentals, and
                experienced tour guides tailored to your preferences. With
                TraviGo, you can effortlessly plan your entire trip, from
                accommodation to transportation, ensuring a hassle-free and
                memorable adventure.
              </p>
              <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition">
                Read More <FaArrowRight className="ml-2 inline" />
              </button>
            </div>

            {/* Right Section (Images - 65%) */}
            <div className="md:w-1/2 flex flex-wrap justify-center gap-4">
              {/* Square Image (1080x1080) */}
              <img
                src={beachImg}
                alt="Beach"
                className="w-full md:w-[48%] h-[300px] object-cover rounded-lg shadow-md"
              />
              {/* Large Landscape Image (1600x1000) */}
              <img
                src={poolImg}
                alt="Pool"
                className="w-full md:w-[48%] h-[300px] object-cover rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Our Services Section */}
      <div className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent mb-12">
            Our Services
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Luxury Stays",
                img: HotelsImg,
                desc: "Discover the perfect stay with TraviGo. From luxury resorts to cozy boutique hotels, we offer a wide range of accommodations to suit every traveler's needs.",
              },
              {
                title: "Tour Packages",
                img: TourGuide,
                desc: "Explore Sri Lanka with ease. Rent reliable vehicles, from compact cars to spacious SUVs, and enjoy seamless travel experiences tailored to your preferences.",
              },
              {
                title: "Vehicle Rentals",
                img: CarRental,
                desc: "Experience Sri Lanka like a local. Hire expert tour guides who will take you on unforgettable journeys through the island's rich culture and stunning landscapes.",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden text-center p-6"
              >
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                <h3 className="text-2xl font-semibold mt-6 text-blue-600">
                  {service.title}
                </h3>
                <p className="text-gray-700 mt-4">{service.desc}</p>
                <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded-lg flex items-center gap-2 mx-auto hover:bg-blue-700 transition">
                  Read More <FaArrowRight className="ml-2 inline" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Us Section */}
      <div className="bg-gray-100 py-12">
        <div className="container mx-auto px-4">
          <ContactUs /> {/* Use the ContactUs component here */}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;