import React, { useEffect, useState } from 'react';

const Bookings = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [adminId, setAdminId] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        // Get the logged-in admin's ID from localStorage
        const provider = JSON.parse(localStorage.getItem('provider'));
        const providerId = provider?._id;
        setAdminId(providerId);

        // Fetch all orders
        const res = await fetch('http://localhost:5000/api/orders'); // Ensure the URL matches your backend server
        const data = await res.json();

        if (res.ok) {
          // Filter orders to only include those belonging to the admin's vehicles
          const filteredOrders = data.filter(
            (order) => order.vehicleId?.providerId === providerId
          );
          setOrders(filteredOrders);
        } else {
          setError(data.message || 'Failed to fetch orders');
        }
      } catch (err) {
        setError('Server error. Please try again.');
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Order ${status.toLowerCase()} successfully!`);
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      } else {
        setError(data.message || 'Failed to update order status');
      }
    } catch (err) {
      setError('Server error. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="text-lg text-blue-700 font-medium">Loading bookings...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <span className="text-lg text-red-600 font-medium">{error}</span>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Bookings</h2>
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}
      <div className="bg-white rounded shadow p-6">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left py-2">Vehicle</th>
              <th className="text-left py-2">Customer</th>
              <th className="text-left py-2">Rental Dates</th>
              <th className="text-left py-2">Total Price</th>
              <th className="text-left py-2">Status</th>
              <th className="text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td className="py-2">{order.vehicleId?.vehicleName || 'N/A'}</td>
                <td className="py-2">{order.userName}</td>
                <td className="py-2">
                  {new Date(order.startDate).toLocaleDateString()} -{' '}
                  {new Date(order.endDate).toLocaleDateString()}
                </td>
                <td className="py-2">${order.totalPrice}</td>
                <td className="py-2">{order.status}</td>
                <td className="py-2">
                  {order.status === 'Pending' && (
                    <>
                      <button
                        className="bg-green-600 text-white px-4 py-2 rounded mr-2 hover:bg-green-700"
                        onClick={() => handleUpdateOrderStatus(order._id, 'Confirmed')}
                      >
                        Accept
                      </button>
                      <button
                        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                        onClick={() => handleUpdateOrderStatus(order._id, 'Cancelled')}
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status !== 'Pending' && (
                    <span className="text-gray-500">No actions available</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="text-center text-gray-500 mt-4">No bookings found for your vehicles.</div>
        )}
      </div>
    </div>
  );
};

export default Bookings;