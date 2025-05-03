import React, { useState, useEffect } from "react";

function IncomingBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings");
        if (!response.ok) {
          throw new Error(`Failed to fetch bookings (status: ${response.status})`);
        }
        const data = await response.json();
        console.log("Fetched bookings:", data);
        setBookings(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleAccept = async (id) => {
    try {
      console.log(`Accepting booking with ID: ${id}`);
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "accepted" }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to accept booking: ${errorData.message || response.status}`);
      }
      const updatedBooking = await response.json();
      console.log("Updated booking:", updatedBooking);
      setBookings(bookings.map((b) => (b._id === id ? updatedBooking : b)));
    } catch (err) {
      console.error("Accept error:", err);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (!confirmDelete) return;

    try {
      console.log(`Deleting booking with ID: ${id}`);
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to delete booking: ${errorData.message || response.status}`);
      }
      console.log("Booking deleted successfully");
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setError(err.message);
    }
  };

  if (loading) return <h2 className="text-center text-gray-600 text-2xl font-semibold py-10">Loading...</h2>;
  if (error) return <h2 className="text-center text-red-600 text-2xl font-semibold py-10">{error}</h2>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Incoming Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600 text-center">No bookings available.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Name</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Check-In Date</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Room Type</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Email</th>
                  <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t">
                    <td className="px-6 py-4 text-gray-700">{`${booking.firstName} ${booking.lastName}`}</td>
                    <td className="px-6 py-4 text-gray-700">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-700">{booking.roomType}</td>
                    <td className="px-6 py-4 text-gray-700">{booking.email}</td>
                    <td className="px-6 py-4">
                      {(!booking.status || booking.status === "pending") ? (
                        <>
                          <button
                            onClick={() => handleAccept(booking._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md mr-2 hover:bg-green-700 transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleDelete(booking._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition"
                          >
                            Delete
                          </button>
                        </>
                      ) : (
                        <span className="text-green-600 font-semibold">Accepted</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default IncomingBookings;