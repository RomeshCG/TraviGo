import React, { useEffect, useState } from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';
import Footer from '../../components/Footer';
import { FaStar, FaCheckCircle } from 'react-icons/fa';

const VehicleRental = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewingId, setReviewingId] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewedOrders, setReviewedOrders] = useState([]);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    const fetchOrdersAndReviews = async () => {
      setLoading(true);
      setError('');
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id;
        const res = await fetch(`http://localhost:5000/api/orders/userid/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
          // Fetch reviews for these orders
          const reviewed = [];
          for (const order of data) {
            if (order.status === 'Completed') {
              const reviewRes = await fetch(`/api/vehicle-order-reviews/order/${order._id}`);
              const reviewData = await reviewRes.json();
              if (reviewRes.ok && reviewData && reviewData.review) {
                reviewed.push(order._id);
              }
            }
          }
          setReviewedOrders(reviewed);
        } else {
          setError(data.message || 'Failed to fetch bookings');
        }
      } catch {
        setError('Server error. Please try again.');
      }
      setLoading(false);
    };
    fetchOrdersAndReviews();
  }, []);

  const handleReviewSubmit = async (order) => {
    setReviewError('');
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      const res = await fetch(`/api/vehicle-order-reviews/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: order._id,
          vehicleId: order.vehicleId?._id || order.vehicleId,
          userId: user._id,
          userName: user.username || user.name,
          rating: review.rating,
          comment: review.comment,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setReviewError(data.message || 'Failed to submit review');
        return;
      }
      setReviewedOrders(prev => [...prev, order._id]);
      setReviewingId(null);
      setReview({ rating: 5, comment: '' });
    } catch {
      setReviewError('Failed to submit review');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="flex flex-1">
        <SidebarUser />
        <div className="flex-1 flex flex-col ml-20 md:ml-64 transition-all duration-300">
          <HeaderUser />
          <div className="p-6 md:p-10 flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">My Vehicle Bookings</h1>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-600 border-opacity-50"></div>
                <span className="ml-4 text-lg text-blue-700 font-medium">Loading bookings...</span>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded mb-6 text-center font-semibold">
                {error}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-gray-500 mt-16 text-center text-xl font-medium">
                You have no vehicle bookings yet.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow-md">
                  <thead>
                    <tr>
                      <th className="py-3 px-4 text-left">Vehicle</th>
                      <th className="py-3 px-4 text-left">Rental Dates</th>
                      <th className="py-3 px-4 text-left">Total Price</th>
                      <th className="py-3 px-4 text-left">Payment</th>
                      <th className="py-3 px-4 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => {
                      const isCompleted = order.status === 'Completed';
                      const isReviewed = reviewedOrders.includes(order._id);
                      return (
                        <React.Fragment key={order._id}>
                          <tr className="border-t">
                            <td className="py-2 px-4 font-semibold">{order.vehicleId?.vehicleName || 'N/A'}</td>
                            <td className="py-2 px-4">{new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}</td>
                            <td className="py-2 px-4">${order.totalPrice}</td>
                            <td className="py-2 px-4">{order.paymentMethod}</td>
                            <td className="py-2 px-4">
                              <span className={
                                order.status === 'Confirmed'
                                  ? 'text-green-600 font-bold'
                                  : order.status === 'Cancelled'
                                  ? 'text-red-600 font-bold'
                                  : order.status === 'Completed'
                                  ? 'text-blue-600 font-bold'
                                  : 'text-yellow-600 font-bold'
                              }>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                          {/* Review section logic */}
                          {isCompleted && (
                            <tr>
                              <td colSpan={5} className="bg-blue-50 p-6 border-b border-blue-100">
                                {isReviewed ? (
                                  <span className="text-green-600 font-semibold flex items-center gap-2 animate-fade-in">
                                    <FaCheckCircle className="text-green-500" /> Thank you for your review!
                                  </span>
                                ) : reviewingId === order._id ? (
                                  <form
                                    onSubmit={e => {
                                      e.preventDefault();
                                      handleReviewSubmit(order);
                                    }}
                                    className="flex flex-col md:flex-row md:items-center gap-3 animate-fade-in"
                                  >
                                    <span className="font-semibold mr-2 text-blue-700">Leave a review for {order.vehicleId?.vehicleName || 'Vehicle'}:</span>
                                    <span className="flex items-center gap-1">
                                      {[1,2,3,4,5].map(star => (
                                        <button
                                          type="button"
                                          key={star}
                                          onClick={() => setReview(r => ({ ...r, rating: star }))}
                                          className={`text-2xl transition-colors ${star <= review.rating ? 'text-yellow-400 scale-110' : 'text-gray-300'} hover:scale-125`}
                                          aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
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
                                      className="border-2 border-blue-200 rounded px-3 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                                      required
                                    />
                                    <button type="submit" className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-lg font-semibold shadow hover:from-blue-700 hover:to-blue-900 transition-all">Submit</button>
                                    <button type="button" className="ml-2 text-gray-500 hover:text-red-400 font-semibold" onClick={() => setReviewingId(null)}>Cancel</button>
                                    {reviewError && <span className="text-red-600 ml-2 font-semibold">{reviewError}</span>}
                                  </form>
                                ) : (
                                  <button
                                    className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg font-semibold shadow hover:bg-yellow-200 transition-all"
                                    onClick={() => setReviewingId(order._id)}
                                  >
                                    Leave a Review
                                  </button>
                                )}
                              </td>
                            </tr>
                          )}
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
  
    </div>
  );
};

export default VehicleRental;
