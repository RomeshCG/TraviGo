import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
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
              className="w-full h-full object-cover"
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
              { title: "Travel Packages", desc: "Enjoy curated experiences tailored to your preferences" }
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

      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">Our Team</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8">
            We're a passionate group of travel enthusiasts and tech experts working together to make your journeys unforgettable.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-blue-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            Ready to Start Your Journey?
          </h2>
          <button 
            className="bg-white text-blue-900 px-8 py-3 rounded-full font-semibold hover:bg-blue-100 transition-colors"
          >
            Explore Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;