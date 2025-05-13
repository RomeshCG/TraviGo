import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SimpleHeader from "../components/SimpleHeader";
import Footer from "../components/Footer";

const LOCATION_ORDER = [
  "Kandy",
  "Colombo",
  "Matara",
  "Galle",
  "Nuwaraeliya",
  "Anuradhapura",
  "Matale",
  "Kurunegala"
];

function getFirstWord(location = "") {
  return location.split(",")[0].trim();
}

function HotelCollection() {
  const [accommodations, setAccommodations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState(""); // price sort
  const [locationFilter, setLocationFilter] = useState("All");
  const location = useLocation();
  const successMessage = location.state?.successMessage;

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

  // Filter by location (optional, like vehicle page)
  const filteredAccommodations = accommodations.filter(a =>
    locationFilter === "All" ? true : getFirstWord(a.location) === locationFilter
  );

  // Sorting logic
  let sortedAccommodations = [...filteredAccommodations];

  if (sortOrder === "lowToHigh") {
    sortedAccommodations.sort((a, b) => a.price - b.price);
  } else if (sortOrder === "highToLow") {
    sortedAccommodations.sort((a, b) => b.price - a.price);
  }

  if (loading) {
    return (
      <>
        <SimpleHeader />
        <div className="pt-24 text-center text-gray-600 text-2xl font-semibold py-10">Loading...</div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <SimpleHeader />
        <div className="pt-24 text-center text-red-600 text-2xl font-semibold py-10">{error}</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SimpleHeader />
      {successMessage && (
        <div className="bg-green-100 text-green-800 text-center py-4 mb-4 rounded">
          {successMessage}
        </div>
      )}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-16 px-4 pt-32">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold text-center text-blue-900 mb-12 tracking-tight drop-shadow-lg">Discover Our Accommodations</h1>
          
          {/* Sorting Section */}
          <div className="flex flex-wrap justify-end mb-8 gap-4">
            <div>
              <label className="mr-2 font-medium text-blue-800">Sort by price:</label>
              <select
                value={sortOrder}
                onChange={e => {
                  setSortOrder(e.target.value);
                }}
                className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">Default</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>
            <div>
              <label className="mr-2 font-medium text-blue-800">Filter by location:</label>
              <select
                value={locationFilter}
                onChange={e => setLocationFilter(e.target.value)}
                className="border border-blue-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="All">All</option>
                {LOCATION_ORDER.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {sortedAccommodations.map((accommodation) => (
              <div
                key={accommodation._id}
                className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border border-blue-100 relative flex flex-col"
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={accommodation.image}
                    alt={accommodation.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-4 left-4 bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">{accommodation.accommodationType}</span>
                </div>
                <div className="flex-1 flex flex-col p-6">
                  <h3 className="text-2xl font-bold text-blue-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {accommodation.name}
                  </h3>
                  <p className="text-gray-500 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {accommodation.location}
                  </p>
                  <p className="text-blue-700 font-semibold text-lg mb-4">${accommodation.price} <span className="text-gray-500 font-normal">/ night</span></p>
                  <div className="flex-1"></div>
                  <Link
                    to={`/hotels/${accommodation._id}`}
                    className="mt-4 inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white py-2 px-6 rounded-full font-semibold shadow hover:from-blue-700 hover:to-blue-900 transition-all duration-300 text-lg"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default HotelCollection;