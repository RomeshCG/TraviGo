import { useEffect, useState } from 'react';
import axios from 'axios';

const PreviousBookings = ({ providerId, setError }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/rentals/provider/${providerId}`);
        const bookings = response.data;
        setBookings(bookings.filter((booking) => booking.status !== 'pending'));
      } catch (err) {
        setError('Failed to fetch previous bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [providerId, setError]);

  if (loading) {
    return <p>Loading bookings...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Previous Bookings</h2>
      {bookings.length === 0 ? (
        <p>No previous bookings.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="bg-white p-4 rounded-lg shadow">
              <p><strong>Booking ID:</strong> {booking._id}</p>
              <p><strong>Vehicle:</strong> {booking.vehicleName}</p>
              <p><strong>Customer:</strong> {booking.customerName}</p>
              <p><strong>Status:</strong> {booking.status}</p>
              <p><strong>Start Date:</strong> {new Date(booking.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(booking.endDate).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PreviousBookings;