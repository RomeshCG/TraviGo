import React, { useEffect, useState } from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';

const BACKEND_URL = 'http://localhost:5000';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser._id) throw new Error('User not found');
        const res = await fetch(`${BACKEND_URL}/api/user/${storedUser._id}/reviews`);
        const data = await res.json();
        if (res.ok && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        } else {
          throw new Error(data.message || 'Failed to fetch reviews');
        }
      } catch (err) {
        setError(err.message || 'Error fetching reviews');
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      <SidebarUser />
      <div style={{ marginLeft: 'var(--sidebar-width, 16rem)' }} className="flex-1">
        <HeaderUser />
        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-bold text-blue-800 mb-8">My Reviews</h1>
          {loading ? (
            <div className="text-gray-600">Loading...</div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : reviews.length === 0 ? (
            <div className="text-gray-500">No reviews found.</div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="bg-white rounded-xl shadow p-6 border border-blue-100">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="font-bold text-blue-700">Guide:</span>
                    <span>{review.tourGuideId?.name || 'Tour Guide'}</span>
                    <span className="ml-4 flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
                      ))}
                    </span>
                  </div>
                  <div className="text-gray-700 italic mb-1">"{review.comment}"</div>
                  <div className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
