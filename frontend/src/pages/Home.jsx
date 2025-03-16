import React from "react";
import Header from "../components/Header";
import backgroundImage from "../assets/TraviGoHero.jpg";

function Home() {
  return (
    <div
  className="relative min-h-screen bg-cover bg-center"
  style={{
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  }}
>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
        <h1 className="text-5xl font-extrabold drop-shadow-lg">
          Discover Your Perfect Stay
        </h1>
        <p className="text-lg mt-4 max-w-2xl">
          Where Your Dream Vacation Becomes a Reality. Customize your travel experience with our exclusive packages.
        </p>
        <button className="mt-6 bg-blue-600 px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition flex items-center">
          More About 
        </button>
      </div>

      {/* Services Section */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-6 bg-white bg-opacity-80 p-4 rounded-lg shadow-lg">
        <div className="p-4 text-center">
          <h3 className="text-2xl font-bold">Hotels</h3>
          <p className="text-gray-600">Find the best hotels for your stay.</p>
        </div>
        <div className="p-4 text-center">
          <h3 className="text-2xl font-bold">Vehicles</h3>
          <p className="text-gray-600">Rent vehicles for your travel needs.</p>
        </div>
        <div className="p-4 text-center">
          <h3 className="text-2xl font-bold">Guides</h3>
          <p className="text-gray-600">Hire experienced tour guides.</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
