import React, { useState, useEffect } from "react";

function IncomingBookings() {
  const [bookings, setBookings] = useState([]);
  const [selectedBooking, setSelectedBooking] = useState(null); // State to hold the selected booking for the summary
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("providerToken");
        // 1. Fetch hotels owned by this provider
        const hotelsRes = await fetch("http://localhost:5000/api/hotels/provider", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!hotelsRes.ok) throw new Error("Failed to fetch hotels");
        const hotels = await hotelsRes.json();
        const hotelIds = hotels.map(h => h._id);

        // 2. Fetch all bookings
        const bookingsRes = await fetch("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
        const allBookings = await bookingsRes.json();

        // 3. Filter bookings for this provider's hotels and pending status
        const pendingBookings = allBookings.filter(
          (booking) =>
            hotelIds.includes(booking.hotelId) &&
            (!booking.status || booking.status === "pending")
        );
        setBookings(pendingBookings);
      } catch (err) {
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

      const data = await response.json();
      console.log("Booking accepted:", data);

      setBookings(bookings.filter((b) => b._id !== id));
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

  const handleViewDetails = (booking) => {
    setSelectedBooking(booking); // Set the selected booking to display the summary
  };

  const handleCloseDetails = () => {
    setSelectedBooking(null); // Clear the selected booking to close the summary
  };

  if (loading) return <div className="text-center text-gray-600 text-xl font-semibold py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 text-xl font-semibold py-10">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">Incoming Bookings</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-600 text-center">No pending bookings available.</p>
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
                      <button
                        onClick={() => handleViewDetails(booking)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-md mr-2 hover:bg-blue-700 transition"
                      >
                        View Full Order
                      </button>
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Full Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Booking Details</h3>
            <p className="text-gray-700 mb-2"><strong>Name:</strong> {`${selectedBooking.firstName} ${selectedBooking.lastName}`}</p>
            <p className="text-gray-700 mb-2"><strong>Email:</strong> {selectedBooking.email}</p>
            <p className="text-gray-700 mb-2"><strong>Phone Number:</strong> {selectedBooking.phoneNumber}</p>
            <p className="text-gray-700 mb-2"><strong>Check-In Date:</strong> {new Date(selectedBooking.checkInDate).toLocaleDateString()}</p>
            <p className="text-gray-700 mb-2"><strong>Check-Out Date:</strong> {new Date(selectedBooking.checkOutDate).toLocaleDateString()}</p>
            <p className="text-gray-700 mb-2"><strong>Room Type:</strong> {selectedBooking.roomType}</p>
            <p className="text-gray-700 mb-2"><strong>Total Price:</strong> ${selectedBooking.totalPrice.toFixed(2)}</p>
            <p className="text-gray-700 mb-2"><strong>Special Requests:</strong> {selectedBooking.specialRequests || "None"}</p>
            <button
              onClick={handleCloseDetails}
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default IncomingBookings;