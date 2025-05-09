import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HotelCollection() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccommodations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hotels");
        if (!response.ok) {
          throw new Error(`Failed to fetch accommodations: ${response.status}`);
        }
        const data = await response.json();
        setAccommodations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAccommodations();
  }, []);

  if (loading) {
    return <h2 className="text-center text-gray-600 text-2xl font-semibold py-10">Loading...</h2>;
  }

  if (error) {
    return <h2 className="text-center text-red-600 text-2xl font-semibold py-10">{error}</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore Accommodations</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {accommodations.map((accommodation) => (
            <div
              key={accommodation._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <img
                src={accommodation.image}
                alt={accommodation.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {accommodation.accommodationType} - {accommodation.name}
                </h3>
                <p className="text-gray-600 mt-1">{accommodation.location}</p>
                <p className="text-gray-800 font-bold mt-2">${accommodation.price}/night</p>
                <Link
                  to={`/hotels/${accommodation._id}`}
                  className="mt-4 inline-block bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HotelCollection;