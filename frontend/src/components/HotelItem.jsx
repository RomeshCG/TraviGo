import React from "react";
import { Link } from "react-router-dom";

const HotelItem = ({ hotel }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl flex flex-col h-full overflow-hidden">
      {/* Image Section */}
      <div className="relative">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-48 object-cover rounded-t-xl transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
          ${hotel.price}/night
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-blue-700 truncate hover:text-blue-800 transition-colors duration-200">
          {hotel.name}
        </h3>
        <p className="text-gray-600 text-sm mt-1 flex items-center">
          {hotel.location}
        </p>
        <div className="flex items-center text-blue-400 mt-2 text-lg">
          {Array(5).fill("⭐").join("")}
        </div>

        {/* Button */}
        <div className="mt-auto pt-4">
          <Link
            to={`/hotels/${hotel._id}`}
            className="block bg-blue-500 text-white text-center py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 font-semibold transform hover:scale-102"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelItem;