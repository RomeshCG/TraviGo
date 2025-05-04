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
          className="w-full h-56 object-cover rounded-t-xl transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full shadow-md">
          ${hotel.price}/night
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-bold text-gray-800 truncate hover:text-blue-600 transition-colors duration-200 mb-2">
          {hotel.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 flex items-center">
          <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 12.414a2 2 0 10-2.828-2.828L6.343 5.343A2 2 0 003.515 8.171l4.243 4.243a2 2 0 102.828 2.828l4.243 4.243a2 2 0 002.828-2.828z"></path>
          </svg>
          {hotel.location}
        </p>
        <div className="flex items-center text-yellow-500 mb-4">
          {Array(5).fill("★").join("")}
          <span className="ml-2 text-gray-600 text-sm">(4.8/5)</span>
        </div>

        {/* Button */}
        <div className="mt-auto">
          <Link
            to={`/hotels/${hotel._id}`}
            className="block bg-blue-600 text-white text-center py-2 px-4 rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 font-semibold transform hover:scale-102"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HotelItem;