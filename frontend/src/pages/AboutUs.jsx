import React from 'react';
import { Link } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <SimpleHeader />

      {/* Main Content with Increased Top Margin */}
      <div className="flex-grow mt-24">
        {/* Hero Section */}
        <section className="relative py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-blue-900 mb-6">
              About TraviGo
            </h1>
            <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
              Your all-in-one travel solution for seamless adventures
            </p>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                At TraviGo, we're dedicated to simplifying travel planning by providing a comprehensive platform that handles all your needs - from hotel bookings and vehicle rentals to expert tour guides and curated experiences. We believe travel should be effortless and enjoyable for everyone.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1"
                alt="Travel destination"
                className="w-full h-64 md:h-80 object-cover"
              />
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">What We Offer</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { title: "Hotel Booking", desc: "Find the perfect stay from our wide range of accommodations" },
                { title: "Vehicle Rental", desc: "Explore at your own pace with our reliable transportation options" },
                { title: "Tour Guides", desc: "Discover destinations with knowledgeable local experts" },
                { title: "Travel Packages", desc: "Enjoy curated experiences tailored to your preferences" },
              ].map((service) => (
                <div
                  key={service.title}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-semibold text-blue-800 mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section (Updated with Quotes, No Images) */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Our Team</h2>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
              We're a passionate group of travel enthusiasts and tech experts working together to make your journeys unforgettable.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Jane Doe",
                  role: "Founder & CEO",
                  quote: "Travel is about creating memories that last a lifetime. At TraviGo, we’re here to make that happen seamlessly.",
                },
                {
                  name: "John Smith",
                  role: "Lead Developer",
                  quote: "We leverage technology to ensure your travel plans are as smooth as your destinations are beautiful.",
                },
                {
                  name: "Emily Johnson",
                  role: "Travel Expert",
                  quote: "Every journey should tell a story. Let us help you write yours with the best experiences.",
                },
              ].map((member) => (
                <div
                  key={member.name}
                  className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center"
                >
                  <h3 className="text-xl font-semibold text-blue-800 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 italic">"{member.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section (Updated Background and Button Color) */}
        <section className="py-16 px-4 bg-white text-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <Link
              to="/"
              className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition-colors"
            >
              Explore Now
            </Link>
          </div>
        </section>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default AboutUs;