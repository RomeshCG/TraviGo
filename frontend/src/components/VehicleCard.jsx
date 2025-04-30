import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  const { _id, name, image, location } = vehicle;

  return (
    <Link to={`/vehicles/${_id}`} className="block">
      <div className="border border-gray-200 rounded-lg shadow-lg p-3 max-w-xs mx-auto bg-white hover:shadow-xl transition-shadow">
        <img
          src={image}
          alt={name}
          className="w-full h-40 object-cover rounded-lg mb-3"
        />
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
          <p className="text-gray-600 text-sm">
            <strong>Location:</strong> {location}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default VehicleCard;