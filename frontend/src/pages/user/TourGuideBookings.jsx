import React, { useEffect, useState } from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';

const TourGuideBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/user/tour-guide-bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

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
                    <tr key={booking._id} className="border-b hover:bg-blue-50 transition">
                      <td className="p-3">{booking.guideId?.name || '-'}</td>
                      <td className="p-3">{booking.packageId?.title || '-'}</td>
                      <td className="p-3">{booking.travelDate ? new Date(booking.travelDate).toLocaleDateString() : '-'}</td>
                      <td className="p-3">{booking.travelersCount}</td>
                      <td className="p-3">{booking.country}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                          booking.status === 'cancelled' ? 'bg-gray-200 text-gray-600' :
                          booking.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-3">${booking.totalPrice?.toFixed(2) || '-'}</td>
                    </tr>
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
