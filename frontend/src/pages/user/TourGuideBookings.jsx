import React, { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';

const TourGuideBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewingId, setReviewingId] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewedBookings, setReviewedBookings] = useState([]);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/tour-bookings', {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        });
        let text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch {
          setError(`Invalid server response: ${text}`);
          setBookings([]);
          return;
        }
        if (!response.ok) {
          setError((data && data.message ? data.message : 'Failed to fetch bookings') + (data && data.error ? ` (${data.error})` : ''));
          setBookings([]);
          return;
        }
        if (!Array.isArray(data)) {
          setError('Unexpected data format from server: ' + JSON.stringify(data));
          setBookings([]);
          return;
        }
        setBookings(data);
        // Fetch reviews for these bookings to prevent duplicate reviews
        try {
          const userStr = localStorage.getItem('user');
          if (!userStr || data.length === 0) return;
          const user = JSON.parse(userStr);
          // Collect all guide IDs for this user's bookings
          const guideIds = [...new Set(data.map(b => b.guideId && typeof b.guideId === 'object' ? b.guideId._id : b.guideId))];
          let reviewed = [];
          for (const guideId of guideIds) {
            if (!guideId) continue;
            const reviewRes = await fetch(`/api/tour-guide/${guideId}/reviews`);
            if (reviewRes.ok) {
              const reviewData = await reviewRes.json();
              // Find reviews by this user for this guide
              reviewData.reviews.forEach(r => {
                if (r.touristId && r.touristId._id === user._id) {
                  // Try to match booking by guideId+touristId+rating+comment (since bookingId is not in model)
                  // Fallback: mark all completed bookings for this guide as reviewed
                  data.forEach(b => {
                    if ((b.guideId?._id || b.guideId) === guideId && b.userId === user._id && (b.bookingStatus === 'completed' || b.status === 'completed')) {
                      reviewed.push(b._id);
                    }
                  });
                }
              });
            }
          }
          setReviewedBookings([...new Set(reviewed)]);
        } catch {
          // Silently ignore review fetch errors
        }
      } catch {
        setError('Unknown error occurred');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleReviewSubmit = async (booking) => {
    setReviewError('');
    setReviewSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setReviewError('You must be logged in to submit a review.');
        return;
      }
      const res = await fetch(`/api/tour-bookings/${booking._id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewerType: 'tourist', rating: review.rating, comment: review.comment }),
      });
      if (!res.ok) {
        let data = {};
        try { data = await res.json(); } catch (error) {
          console.error('Error parsing JSON response:', error);
        }
        setReviewError(data.message || 'Failed to submit review');
        return;
      }
      setReviewSuccess('Thank you for your review!');
      setReviewedBookings(prev => [...prev, booking._id]);
      setReviewingId(null);
      setReview({ rating: 5, comment: '' });
    } catch {
      setReviewError('Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      <SidebarUser />
      <div className="flex-1">
        <HeaderUser />
        <div className="p-6 md:p-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Tour Guide Bookings</h1>
          {loading ? (
            <div className="text-center text-lg text-gray-600">Loading...</div>
          ) : error ? (
            <div className="text-center text-red-600 font-semibold">{error}</div>
          ) : bookings.length === 0 ? (
            <div className="text-center text-gray-600">No tour guide bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow">
                <thead>
                  <tr>
                    <th className="p-3 text-left">Guide Name</th>
                    <th className="p-3 text-left">Package</th>
                    <th className="p-3 text-left">Travel Date</th>
                    <th className="p-3 text-left">Travelers</th>
                    <th className="p-3 text-left">Country</th>
                    <th className="p-3 text-left">Status</th>
                    <th className="p-3 text-left">Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <React.Fragment key={booking._id}>
                      <tr className="border-b hover:bg-blue-50 transition">
                        <td className="p-3">{booking.guideId && typeof booking.guideId === 'object' ? booking.guideId.name : String(booking.guideId)}</td>
                        <td className="p-3">{booking.packageId && typeof booking.packageId === 'object' ? booking.packageId.title : String(booking.packageId)}</td>
                        <td className="p-3">{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : '-'}</td>
                        <td className="p-3">{booking.travelersCount ?? '-'}</td>
                        <td className="p-3">{booking.country ?? '-'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            (booking.bookingStatus || booking.status) === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            (booking.bookingStatus || booking.status) === 'confirmed' ? 'bg-green-100 text-green-800' :
                            (booking.bookingStatus || booking.status) === 'cancelled' ? 'bg-gray-200 text-gray-600' :
                            (booking.bookingStatus || booking.status) === 'approved' ? 'bg-blue-100 text-blue-800' :
                            (booking.bookingStatus || booking.status) === 'rejected' ? 'bg-red-100 text-red-800' :
                            (booking.bookingStatus || booking.status) === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.bookingStatus || booking.status}
                          </span>
                        </td>
                        <td className="p-3">{booking.totalPrice !== undefined ? `$${Number(booking.totalPrice).toFixed(2)}` : '-'}</td>
                      </tr>
                      {(booking.bookingStatus === 'completed' || booking.status === 'completed') &&
                        !reviewedBookings.includes(booking._id) && (
                          <tr>
                            <td colSpan={7} className="bg-gray-50 p-4">
                              {reviewingId === booking._id ? (
                                <form
                                  onSubmit={e => {
                                    e.preventDefault();
                                    handleReviewSubmit(booking);
                                  }}
                                  className="flex flex-col md:flex-row md:items-center gap-2"
                                >
                                  <span className="font-semibold mr-2">Leave a review for {booking.guideId && typeof booking.guideId === 'object' ? booking.guideId.name : 'Guide'}:</span>
                                  <span className="flex items-center">
                                    {[1,2,3,4,5].map(star => (
                                      <button
                                        type="button"
                                        key={star}
                                        onClick={() => setReview(r => ({ ...r, rating: star }))}
                                        className={star <= review.rating ? 'text-yellow-500' : 'text-gray-300'}
                                      >
                                        <FaStar />
                                      </button>
                                    ))}
                                  </span>
                                  <input
                                    type="text"
                                    value={review.comment}
                                    onChange={e => setReview(r => ({ ...r, comment: e.target.value }))}
                                    placeholder="Write your review..."
                                    className="border rounded px-2 py-1 flex-1"
                                    required
                                  />
                                  <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">Submit</button>
                                  <button type="button" className="ml-2 text-gray-500" onClick={() => setReviewingId(null)}>Cancel</button>
                                  {reviewError && <span className="text-red-600 ml-2">{reviewError}</span>}
                                </form>
                              ) : reviewSuccess && reviewedBookings.includes(booking._id) ? (
                                <span className="text-green-600 font-semibold">Thank you for your review!</span>
                              ) : (
                                <button
                                  className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded"
                                  onClick={() => setReviewingId(booking._id)}
                                >
                                  Leave a Review
                                </button>
                              )}
                            </td>
                          </tr>
                        )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TourGuideBookings;
