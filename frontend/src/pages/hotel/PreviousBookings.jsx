import { useState, useEffect } from "react";

function PreviousBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("providerToken");
        // Fetch hotels owned by this provider
        const hotelsRes = await fetch("http://localhost:5000/api/hotels/provider", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!hotelsRes.ok) throw new Error("Failed to fetch hotels");
        const hotels = await hotelsRes.json();
        const hotelIds = hotels.map(h => h._id);

        // Fetch all bookings
        const bookingsRes = await fetch("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!bookingsRes.ok) throw new Error("Failed to fetch bookings");
        const allBookings = await bookingsRes.json();

        // Filter bookings for this provider's hotels and accepted status
        const acceptedBookings = allBookings.filter(
          (booking) =>
            hotelIds.includes(booking.hotelId) &&
            booking.status === "accepted"
        );
        setBookings(acceptedBookings);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const handleComplete = async (id) => {
    try {
      const confirmComplete = window.confirm("Are you sure you want to mark this booking as completed?");
      if (!confirmComplete) return;

      console.log(`Marking booking with ID: ${id} as completed`);
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to complete booking: ${errorData.message || response.status}`);
      }

      console.log("Booking marked as completed successfully");
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      console.error("Complete error:", err);
      setError(err.message);
    }
  };

  if (loading) return <div className="text-center text-gray-600 text-xl font-semibold py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 text-xl font-semibold py-10">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Accepted Bookings</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-600 text-center">No accepted bookings available.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Name</th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Check-In Date</th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Check-Out Date</th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Room Type</th>
                <th className="px-6 py-3 text-left text-gray-700 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking._id} className="border-t">
                  <td className="px-6 py-4 text-gray-700">{`${booking.firstName} ${booking.lastName}`}</td>
                  <td className="px-6 py-4 text-gray-700">{new Date(booking.checkInDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-700">{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-gray-700">{booking.roomType}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleComplete(booking._id)}
                      className="bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition"
                    >
                      Complete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default PreviousBookings;