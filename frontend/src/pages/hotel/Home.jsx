import { useState, useEffect } from "react";
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";
import { Pie, Bar } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Home() {
  const [summary, setSummary] = useState({
    acceptedBookings: 0,
    incomingBookings: 0,
    totalRevenue: 0,
    totalHotels: 0,
    bookingStatus: { pending: 0, accepted: 0, cancelled: 0 },
    hotelPerformance: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("providerToken");

        // Fetch bookings
        const bookingsResponse = await fetch("http://localhost:5000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!bookingsResponse.ok) throw new Error("Failed to fetch bookings");
        const bookings = await bookingsResponse.json();

        // Fetch hotels owned by the provider
        const hotelsResponse = await fetch("http://localhost:5000/api/hotels/provider", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!hotelsResponse.ok) throw new Error("Failed to fetch hotels");
        const hotels = await hotelsResponse.json();

        // Filter bookings by status
        const acceptedBookings = bookings.filter((booking) => booking.status === "accepted");
        const incomingBookings = bookings.filter((booking) => !booking.status || booking.status === "pending");

        // Calculate summary metrics
        const totalRevenue = acceptedBookings.reduce((sum, booking) => {
          const price = Number(booking.totalPrice) || 0;
          return sum + price;
        }, 0);
        const totalHotels = hotels.length;

        // Booking status distribution
        const bookingStatus = bookings.reduce(
          (acc, booking) => {
            const status = booking.status || "pending";
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          },
          { pending: 0, accepted: 0, cancelled: 0 }
        );

        // Hotel performance (bookings per hotel)
        const hotelPerformance = hotels.map((hotel) => ({
          name: hotel.name,
          bookingsCount: bookings.filter((b) => b.hotelId === hotel._id).length,
        }));

        setSummary({
          acceptedBookings: acceptedBookings.length,
          incomingBookings: incomingBookings.length,
          totalRevenue,
          totalHotels,
          bookingStatus,
          hotelPerformance,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Pie chart data for booking status
  const pieChartData = {
    labels: ["Pending", "Accepted", "Cancelled"],
    datasets: [
      {
        data: [summary.bookingStatus.pending, summary.bookingStatus.accepted, summary.bookingStatus.cancelled],
        backgroundColor: ["#FBBF24", "#10B981", "#EF4444"],
        borderColor: ["#FFFFFF", "#FFFFFF", "#FFFFFF"],
        borderWidth: 1,
      },
    ],
  };

  // Bar chart data for hotel performance
  const barChartData = {
    labels: summary.hotelPerformance.map((hotel) => hotel.name),
    datasets: [
      {
        label: "Bookings",
        data: summary.hotelPerformance.map((hotel) => hotel.bookingsCount),
        backgroundColor: "#3B82F6",
        borderColor: "#2563EB",
        borderWidth: 1,
      },
    ],
  };

  if (loading) return <div className="text-center text-gray-600 text-xl font-semibold py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 text-xl font-semibold py-10">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Dashboard Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900">Accepted Bookings</h3>
          <p className="text-2xl font-bold text-blue-600">{summary.acceptedBookings}</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900">Incoming Bookings</h3>
          <p className="text-2xl font-bold text-yellow-600">{summary.incomingBookings}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${summary.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Status Distribution</h3>
          <div className="h-64">
            <Pie
              data={pieChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: "top" } },
              }}
            />
          </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Performance</h3>
          <div className="h-64">
            <Bar
              data={barChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: "Bookings" } },
                  x: { title: { display: true, text: "Hotels" } },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;