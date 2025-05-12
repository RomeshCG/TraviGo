import React, { useEffect, useState } from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';
import Footer from '../../components/Footer';

const UserVehicleBookings = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        const userId = user?._id;
        const res = await fetch(`http://localhost:5000/api/orders/userid/${userId}`);
        const data = await res.json();
        if (res.ok) {
          setOrders(data);
        } else {
          setError(data.message || 'Failed to fetch bookings');
        }
      } catch {
        setError('Server error. Please try again.');
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col">
      <div className="flex flex-1">
        <SidebarUser />
        <div className="flex-1 flex flex-col">
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
                    {orders.map((order) => (
                      <tr key={order._id} className="border-t">
                        <td className="py-2 px-4 font-semibold">
                          {order.vehicleId?.vehicleName || 'N/A'}
                        </td>
                        <td className="py-2 px-4">
                          {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}
                        </td>
                        <td className="py-2 px-4">${order.totalPrice}</td>
                        <td className="py-2 px-4">{order.paymentMethod}</td>
                        <td className="py-2 px-4">
                          <span className={
                            order.status === 'Confirmed'
                              ? 'text-green-600 font-bold'
                              : order.status === 'Cancelled'
                              ? 'text-red-600 font-bold'
                              : 'text-yellow-600 font-bold'
                          }>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserVehicleBookings;
