import React from "react";
import { Link } from "react-router-dom";
import SimpleHeader from "../components/SimpleHeader";
import Footer from "../components/Footer";
import HeroImage from "../assets/aboutusimg2.png";
import Ourpartner1 from "../assets/cafelavia.png";
import Ourpartner2 from "../assets/queenstours.png";
import Ourpartner3 from "../assets/jetwinghotels.png";
import Ourpartner4 from "../assets/tepraas.png";
import Ourpartner5 from "../assets/islandtravels.png";

// Define navigation links for services
const serviceLinks = {
  "Hotel Booking": "/services/hotel-listings",
  "Vehicle Rental": "/services/vehicle-listings",
  "Tour Guides": "/tour-guides",
};

// Partner logos (limited to 5)
const partnerLogos = [
  Ourpartner1,
  Ourpartner2,
  Ourpartner3,
  Ourpartner4,
  Ourpartner5,
];

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-gray-100 font-sans">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-lg">
        <SimpleHeader />
      </div>

      {/* Main Content */}
      <div className="flex-grow mt-24">
        {/* Hero Section with Single Image */}
        <section
          className="relative min-h-[50vh] flex items-center justify-center text-center bg-cover bg-center"
          style={{
            backgroundImage: `url(${HeroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative z-10 text-white">
            <h1 className="text-4xl md:text-5xl font-bold bg-white bg-clip-text text-transparent animate-fade-in">
              About Us
            </h1>
            <p className="text-lg md:text-xl mt-4 max-w-3xl mx-auto animate-fade-in">
              Your trusted partner in crafting unforgettable travel experiences.
            </p>
          </div>
          <div className="absolute inset-0 bg-black/40" /> {/* Overlay for readability */}
        </section>

        {/* Our Story Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-0">
            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent mb-12">
              Our Story
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg max-w-4xl mx-auto">
              Travel is more than just visiting places—it’s about experiences, memories, and connections. That’s why we created TraviGo, a platform designed to revolutionize the way travelers explore Sri Lanka.
              Our journey began with a simple vision: to build an all-in-one tourism super app that makes trip planning seamless, whether you're booking a tour guide, reserving a hotel, or arranging transport. As passionate tech enthusiasts and travel lovers, we saw the challenges travelers face—scattered services, lack of reliable information, and complicated bookings. TraviGo was born to bridge these gaps.
              With cutting-edge technology and a user-first approach, we bring travelers and service providers together in one smart ecosystem. Our platform empowers tour guides, hotels, and transport providers to connect with travelers effortlessly while ensuring a smooth, hassle-free experience for adventurers.
              At TraviGo, we’re not just building a platform—we’re shaping the future of travel in Sri Lanka. Whether you're a solo explorer, a family on vacation, or a service provider looking to grow, we’re here to make every journey unforgettable.
              Welcome to TraviGo—your gateway to seamless travel experiences!
            </p>
          </div>
        </section>

        {/* Mission & Vision Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-0">
            <div className="grid md:grid-cols-2 gap-12">
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Mission</h2>
                <p className="text-gray-700 leading-relaxed">
                  To empower travelers worldwide by delivering seamless, personalized travel experiences that inspire adventure and connection in 2025 and beyond.
                </p>
              </div>
              <div className="bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Vision</h2>
                <p className="text-gray-700 leading-relaxed">
                  To be the leading global platform for travel planning, blending cutting-edge technology with human expertise to create unforgettable journeys.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services Section (Clickable) */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-0">
            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent mb-12">
              Our Services
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { title: "Hotel Booking", desc: "Luxury and budget stays." },
                { title: "Vehicle Rental", desc: "Reliable travel options." },
                { title: "Tour Guides", desc: "Expert local insights." },
              ].map((service) => (
                <Link
                  key={service.title}
                  to={serviceLinks[service.title]}
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer"
                >
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Our Partners Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-0">
            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-500 bg-clip-text text-transparent mb-12">
              Our Partners
            </h2>
            <div className="overflow-hidden relative">
              <div className="flex animate-slide whitespace-nowrap">
                {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                  <img
                    key={index}
                    src={logo}
                    alt={`Partner ${index % 5 + 1}`} // Updated to reflect 5 partners
                    className="h-20 mx-6 object-contain" // Increased size to h-20 (80px)
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 text-center">
          <div className="max-w-7xl mx-auto px-0">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Ready to Explore?</h2>
            <Link
              to="/"
              className="bg-gradient-to-r from-blue-600 to-purple-500 text-white px-8 py-3 rounded-full font-semibold hover:from-blue-700 hover:to-purple-600 transition-all"
            >
              Start Your Journey
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;