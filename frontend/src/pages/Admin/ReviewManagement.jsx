import React, { useState, useEffect } from 'react';
import { FaStar, FaSearch, FaFilter, FaExclamationTriangle, FaCheck, FaTimes, FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import axios from 'axios';
import AdminSidebar from '../../components/SidebarAdmin';
import AdminHeader from '../../components/AdminHeader';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const ReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRating, setFilterRating] = useState(0);
  const [sortOrder, setSortOrder] = useState('newest'); // 'newest' or 'oldest'
  const [selectedReview, setSelectedReview] = useState(null);
  const [showStatsPanel, setShowStatsPanel] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('/api/admin/reviews', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data.reviews);
        setStats(res.data.stats);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // Filter and sort reviews
  const filteredReviews = reviews.filter(review => {
    const matchesSearch = searchTerm === '' || 
      (review.comment && review.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (review.tourGuideId?.name && review.tourGuideId.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (review.touristId?.username && review.touristId.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRating = filterRating === 0 || review.rating === filterRating;
    
    return matchesSearch && matchesRating;
  });

  // Sort based on date
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortOrder === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt);
    }
  });

  const handleSortToggle = () => {
    setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest');
  };

  const pieChartData = stats ? {
    labels: ['5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'],
    datasets: [
      {
        label: 'Number of Reviews',
        data: [stats.ratings[5], stats.ratings[4], stats.ratings[3], stats.ratings[2], stats.ratings[1]],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderWidth: 1,
      },
    ],
  } : null;

  const barChartData = stats ? {
    labels: ['Good (4-5★)', 'Neutral (3★)', 'Bad (1-2★)'],
    datasets: [
      {
        label: 'Review Distribution',
        data: [stats.good, stats.neutral, stats.bad],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
      },
    ],
  } : null;

  const barChartOptions = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const renderStars = (rating) => {
    return Array(5).fill(0).map((_, i) => (
      <FaStar 
        key={i} 
        className={i < rating ? "text-yellow-400" : "text-gray-300"} 
      />
    ));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="flex flex-1">
        <AdminSidebar />
        
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                Review Management
              </span>
            </h1>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md flex items-center">
                <FaExclamationTriangle className="mr-2" /> {error}
              </div>
            ) : (
              <>
                {/* Statistics Section */}
                <div className={`transition-all duration-300 transform ${showStatsPanel ? 'scale-y-100 max-h-[800px]' : 'scale-y-0 max-h-0 overflow-hidden'}`}>
                  <div className="mb-6 bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">Review Statistics</h2>
                      <button 
                        onClick={() => setShowStatsPanel(!showStatsPanel)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        {showStatsPanel ? <FaTimes /> : <FaCheck />}
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 shadow-sm">
                        <div className="text-4xl font-bold text-indigo-800">{stats?.total || 0}</div>
                        <div className="text-sm text-indigo-600 font-medium">Total Reviews</div>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-teal-100 rounded-lg p-4 shadow-sm">
                        <div className="text-4xl font-bold text-teal-800">{stats?.good || 0}</div>
                        <div className="text-sm text-teal-600 font-medium">Positive Reviews (4-5★)</div>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-pink-100 rounded-lg p-4 shadow-sm">
                        <div className="text-4xl font-bold text-red-800">{stats?.bad || 0}</div>
                        <div className="text-sm text-red-600 font-medium">Negative Reviews (1-2★)</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col items-center">
                        <h3 className="text-lg font-medium mb-2 text-center">Rating Distribution</h3>
                        {pieChartData && (
                          <div style={{ maxWidth: 220 }}>
                            <Pie data={pieChartData} width={200} height={200} />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col items-center">
                        <h3 className="text-lg font-medium mb-2 text-center">Review Sentiment</h3>
                        {barChartData && (
                          <div style={{ maxWidth: 260 }}>
                            <Bar data={barChartData} options={barChartOptions} width={240} height={200} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters and Search */}
                <div className="bg-white rounded-xl shadow-md p-4 mb-6">
                  <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 items-center justify-between">
                    <div className="w-full md:w-1/2">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search reviews, tour guides, or tourists..."
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                        <FaSearch className="absolute left-3 top-3 text-gray-400" />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <FaFilter className="mr-2 text-gray-500" />
                        <select
                          value={filterRating}
                          onChange={e => setFilterRating(Number(e.target.value))}
                          className="border border-gray-300 rounded-lg px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                          <option value={0}>All Ratings</option>
                          <option value={5}>5 Stars</option>
                          <option value={4}>4 Stars</option>
                          <option value={3}>3 Stars</option>
                          <option value={2}>2 Stars</option>
                          <option value={1}>1 Star</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={handleSortToggle}
                        className="flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors"
                      >
                        {sortOrder === 'newest' ? (
                          <>
                            <FaSortAmountDown className="mr-2" /> Newest
                          </>
                        ) : (
                          <>
                            <FaSortAmountUp className="mr-2" /> Oldest
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reviews Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                          <th className="p-3 text-left">Rating</th>
                          <th className="p-3 text-left">Review</th>
                          <th className="p-3 text-left">Tour Guide</th>
                          <th className="p-3 text-left">Tourist</th>
                          <th className="p-3 text-left">Date</th>
                          <th className="p-3 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedReviews.length === 0 ? (
                          <tr>
                            <td colSpan="6" className="p-4 text-center text-gray-500">
                              No reviews match your filters
                            </td>
                          </tr>
                        ) : (
                          sortedReviews.map((review) => (
                            <tr key={review._id} className="border-b hover:bg-gray-50 transition-colors">
                              <td className="p-3">
                                <div className="flex">
                                  {renderStars(review.rating)}
                                </div>
                              </td>
                              <td className="p-3">
                                <div className="max-w-xs overflow-hidden text-ellipsis">
                                  {review.comment?.length > 100
                                    ? `${review.comment.slice(0, 100)}...`
                                    : review.comment}
                                </div>
                              </td>
                              <td className="p-3">{review.tourGuideId?.name || 'Unknown'}</td>
                              <td className="p-3">{review.touristId?.username || 'Unknown'}</td>
                              <td className="p-3">{new Date(review.createdAt).toLocaleDateString()}</td>
                              <td className="p-3 text-center">
                                <button
                                  onClick={() => setSelectedReview(review)}
                                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-lg hover:bg-indigo-200"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Review Details</h3>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-500 hover:text-gray-800"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-gray-600 text-sm">Tourist:</div>
                <div className="font-medium">{selectedReview.touristId?.username || 'Unknown'}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Tour Guide:</div>
                <div className="font-medium">{selectedReview.tourGuideId?.name || 'Unknown'}</div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Rating:</div>
                <div className="flex">
                  {renderStars(selectedReview.rating)}
                </div>
              </div>
              <div>
                <div className="text-gray-600 text-sm">Date:</div>
                <div className="font-medium">{new Date(selectedReview.createdAt).toLocaleString()}</div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="text-gray-600 text-sm">Review:</div>
              <div className="bg-gray-50 p-3 rounded-lg mt-1">
                {selectedReview.comment || 'No comment provided'}
              </div>
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={() => setSelectedReview(null)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewManagement;
