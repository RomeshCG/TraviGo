import React, { useEffect, useState } from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';
import { FaStar, FaCheckCircle } from 'react-icons/fa';

const HotelBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewingId, setReviewingId] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewedBookings, setReviewedBookings] = useState([]);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user || !user._id) {
          setError('User not logged in');
          return;
        }

        const response = await fetch(`http://localhost:5000/api/bookings/user/${user._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${response.statusText}`);
        }

        const data = await response.json();
        setBookings(data);

        // Fetch reviews for these bookings
        const reviewed = await Promise.all(
          data.map(async (booking) => {
            const reviewResponse = await fetch(`/api/hotel-reviews/booking/${booking._id}`);
            if (reviewResponse.ok) {
              const reviewData = await reviewResponse.json();
              return reviewData.review ? booking._id : null;
            }
            return null;
          })
        );
        setReviewedBookings(reviewed.filter((id) => id !== null));
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const exportToExcel = () => {
    const exportData = bookings.map((b) => ({
      'Room Type': b.roomType,
      'Check-In Date': new Date(b.checkInDate).toLocaleDateString(),
      'Check-Out Date': new Date(b.checkOutDate).toLocaleDateString(),
      'Nights': b.nights || '-',
      'Status': b.status || 'Pending',
      'Total Price': `$${b.totalPrice.toFixed(2)}`,
    }));
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hotel Bookings');
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: 'application/octet-stream' }), 'hotel_bookings.xlsx');
  };

  const handleReviewSubmit = async (booking) => {
    setReviewError('');
    setReviewSuccess('');
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setReviewError('You must be logged in to submit a review.');
        return;
      }
      const res = await fetch('/api/hotel-reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          bookingId: booking._id,
          hotelId: booking.hotelId,
          userId: booking.userId,
          rating: review.rating,
          comment: review.comment,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        setReviewError(data.message || 'Failed to submit review');
        return;
      }
      setReviewSuccess('Thank you for your review!');
      setReviewedBookings((prev) => [...prev, booking._id]);
      setReviewingId(null);
      setReview({ rating: 5, comment: '' });
    } catch {
      setReviewError('Failed to submit review');
    }
  };

  if (loading) return <div className="text-center text-gray-600 text-xl font-semibold py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 text-xl font-semibold py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex">
      <SidebarUser />
      <div style={{ marginLeft: 'var(--sidebar-width, 16rem)' }} className="flex-1">
        <HeaderUser />
        <div className="p-6 md:p-10">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-extrabold text-blue-800 flex items-center gap-3">
              <FaCheckCircle className="text-blue-400" /> My Hotel Bookings
            </h1>
            {bookings.length > 0 && (
              <button
                onClick={exportToExcel}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition"
              >
                Export to Excel
              </button>
            )}
          </div>
          {bookings.length === 0 ? (
            <div className="text-center text-gray-600">No hotel bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-3xl shadow-xl border border-blue-100">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-100 to-blue-50">
                    <th className="p-3 text-left font-semibold text-blue-700">Room Type</th>
                    <th className="p-3 text-left font-semibold text-blue-700">Check-In Date</th>
                    <th className="p-3 text-left font-semibold text-blue-700">Check-Out Date</th>
                    <th className="p-3 text-left font-semibold text-blue-700">Nights</th>
                    <th className="p-3 text-left font-semibold text-blue-700">Status</th>
                    <th className="p-3 text-left font-semibold text-blue-700">Total Price</th>
                    <th className="p-3 text-left font-semibold text-blue-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const isCompleted = booking.status === 'completed';
                    const isReviewed = reviewedBookings.includes(booking._id);
                    return (
                      <React.Fragment key={booking._id}>
                        <tr className="border-b hover:bg-blue-50 transition">
                          <td className="p-3 font-medium text-gray-800">{booking.roomType}</td>
                          <td className="p-3">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                          <td className="p-3">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                          <td className="p-3">{booking.nights || '-'}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 ${
                                isCompleted ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              {isCompleted ? 'Completed' : 'Accepted'}
                            </span>
                          </td>
                          <td className="p-3">{`$${booking.totalPrice.toFixed(2)}`}</td>
                          <td className="p-3">
                            {isCompleted && !isReviewed ? (
                              reviewingId === booking._id ? (
                                <form
                                  onSubmit={(e) => {
                                    e.preventDefault();
                                    handleReviewSubmit(booking);
                                  }}
                                  className="flex flex-col md:flex-row md:items-center gap-3"
                                >
                                  <span className="font-semibold text-blue-700">Leave a review:</span>
                                  <span className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                      <button
                                        type="button"
                                        key={star}
                                        onClick={() => setReview((r) => ({ ...r, rating: star }))}
                                        className={`text-2xl transition-colors ${
                                          star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                        }`}
                                      >
                                        <FaStar />
                                      </button>
                                    ))}
                                  </span>
                                  <input
                                    type="text"
                                    value={review.comment}
                                    onChange={(e) => setReview((r) => ({ ...r, comment: e.target.value }))}
                                    placeholder="Write your review..."
                                    className="border-2 border-blue-200 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                    required
                                  />
                                  <button
                                    type="submit"
                                    className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-blue-900 transition-all"
                                  >
                                    Submit
                                  </button>
                                  <button
                                    type="button"
                                    className="ml-2 text-gray-500 hover:text-red-400 font-semibold"
                                    onClick={() => setReviewingId(null)}
                                  >
                                    Cancel
                                  </button>
                                  {reviewError && <span className="text-red-600 ml-2 font-semibold">{reviewError}</span>}
                                </form>
                              ) : (
                                <button
                                  className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold shadow hover:bg-yellow-200 transition-all"
                                  onClick={() => setReviewingId(booking._id)}
                                >
                                  Leave a Review
                                </button>
                              )
                            ) : isReviewed ? (
                              <span className="text-green-600 font-semibold">Reviewed</span>
                            ) : (
                              <span className="text-gray-500">Not eligible for review</span>
                            )}
                          </td>
                        </tr>
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelBooking;