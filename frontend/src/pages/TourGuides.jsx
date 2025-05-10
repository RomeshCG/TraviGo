// src/pages/TourGuides.jsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader'; // Adjust path as needed
import Footer from '../components/Footer'; // Adjust path as needed
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const TourGuides = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('default');
  const [locationFilter, setLocationFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [ratings, setRatings] = useState({});

  const BASE_URL = 'http://localhost:5000';

  // Get unique locations and languages for filter dropdowns
  const locations = Array.from(new Set(tourGuides.map(g => g.location).filter(Boolean)));
  const languages = Array.from(new Set(tourGuides.flatMap(g => g.languages || [])));

  // Filtering and sorting logic
  const filteredGuides = tourGuides
    .filter(g => (locationFilter ? g.location === locationFilter : true))
    .filter(g => (languageFilter ? (g.languages || []).includes(languageFilter) : true));

  const sortedGuides = [...filteredGuides].sort((a, b) => {
    const aRating = ratings[a._id]?.avgRating || 0;
    const bRating = ratings[b._id]?.avgRating || 0;
    if (sortOrder === 'rating-high') return bRating - aRating;
    if (sortOrder === 'rating-low') return aRating - bRating;
    return 0;
  });

  useEffect(() => {
    const fetchTourGuides = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/tour-guides`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Fetched tour guides (frontend):', data);
        setTourGuides(data);
      } catch (error) {
        setError(error.message);
        console.error('Error fetching tour guides:', error);
        toast.error(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTourGuides();
  }, []);

  useEffect(() => {
    // Fetch ratings for all tour guides
    const fetchRatings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/tour-guides/ratings`);
        if (!res.ok) throw new Error('Failed to fetch ratings');
        const data = await res.json();
        setRatings(data);
      } catch {
        // Optionally handle error
      }
    };
    fetchRatings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      <SimpleHeader />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover />
      <div className="flex-grow container mx-auto p-6 md:p-10 mt-20 mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-10">
          Discover Your Perfect{' '}
          <span className="bg-gradient-to-r from-green-500 to-teal-500 text-transparent bg-clip-text">Tour Guide</span>
        </h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex gap-4">
            <select
              className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={sortOrder}
              onChange={e => setSortOrder(e.target.value)}
            >
              <option value="default">Sort by</option>
              <option value="rating-high">Rating: High to Low</option>
              <option value="rating-low">Rating: Low to High</option>
            </select>
            <select
              className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={locationFilter}
              onChange={e => setLocationFilter(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              className="border rounded-lg px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={languageFilter}
              onChange={e => setLanguageFilter(e.target.value)}
            >
              <option value="">All Languages</option>
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang}</option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p className="text-red-600 text-center mb-6 font-medium bg-red-100 py-3 rounded-lg">{error}</p>
        )}

        {loading ? (
          <div className="text-center">
            <p className="text-gray-600 text-lg">Loading tour guides...</p>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-green-500 h-12 w-12 mx-auto mt-4 animate-spin"></div>
          </div>
        ) : sortedGuides.length === 0 ? (
          <p className="text-center text-gray-600 text-lg">No tour guides match your criteria.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedGuides.map((guide) => {
              const guideRating = ratings[guide._id]?.avgRating || 0;
              const reviewCount = ratings[guide._id]?.reviewCount || 0;
              return (
                <div
                  key={guide._id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative"
                >
                  {/* Rating badge top left */}
                  <div className="absolute top-4 left-4 bg-white/90 rounded-full px-3 py-1 flex items-center gap-1 shadow text-yellow-500 font-semibold text-sm z-10">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg key={i} className={`w-4 h-4 ${i < Math.round(guideRating) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.966c.3.922-.755 1.688-1.54 1.118l-3.38-2.454a1 1 0 00-1.175 0l-3.38 2.454c-.784.57-1.838-.196-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z" /></svg>
                    ))}
                    <span className="ml-2 text-gray-700">{guideRating.toFixed(1)}</span>
                    <span className="ml-1 text-gray-400">({reviewCount})</span>
                  </div>
                  {/* Banner */}
                  <div className="h-48 overflow-hidden">
                    <img
                      src={guide.banner ? `${BASE_URL}${guide.banner}` : 'https://via.placeholder.com/400x200?text=Tour+Service+Banner'}
                      alt={`${guide.name}'s Tour Service Banner`}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <img
                          src={guide.profilePicture ? `${BASE_URL}${guide.profilePicture}` : 'https://via.placeholder.com/100'}
                          alt={`${guide.name}'s Profile`}
                          className="w-12 h-12 rounded-full border-4 border-gradient-to-r from-green-500 to-teal-500 shadow-md mr-3"
                        />
                        <div>
                          <h2 className="text-xl font-semibold text-gray-800">{guide.name}</h2>
                          {guide.verifiedBadge && (
                            <span className="inline-flex items-center bg-green-500 text-white text-sm px-2 py-1 rounded-full mt-1 shadow-md">
                              Verified <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-gray-700">
                      <p className="line-clamp-2"><strong className="font-semibold">Bio:</strong> {guide.bio || 'No bio available'}</p>
                      <p><strong className="font-semibold">Location:</strong> {guide.location || 'Not specified'}</p>
                      <p><strong className="font-semibold">Languages:</strong> {guide.languages?.join(', ') || 'Not listed'}</p>
                      <p><strong className="font-semibold">Experience:</strong> {guide.yearsOfExperience ? `${guide.yearsOfExperience} years` : 'N/A'}</p>
                    </div>
                    <Link
                      to={`/tour-guide/${guide.providerId}`}
                      className="mt-4 inline-block w-full text-center bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-600 hover:to-teal-600 transition shadow-md"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TourGuides;