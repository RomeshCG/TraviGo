import { useState, useEffect } from "react";
import { FaDownload } from "react-icons/fa";

function Reports() {
  const [reportData, setReportData] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    hotelPerformance: [],
  });
  const [dateRange, setDateRange] = useState({
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        // Fetch bookings for revenue and total bookings
        const bookingsResponse = await fetch("http://localhost:5000/api/bookings");
        if (!bookingsResponse.ok) throw new Error("Failed to fetch bookings");
        const bookings = await bookingsResponse.json();

        // Fetch hotels for performance metrics
        const hotelsResponse = await fetch("http://localhost:5000/api/hotels");
        if (!hotelsResponse.ok) throw new Error("Failed to fetch hotels");
        const hotels = await hotelsResponse.json();

        // Calculate metrics
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((sum, booking) => {
          const price = Number(booking.bookingPrice) || 0;
          return sum + price;
        }, 0);

        // Calculate hotel performance (e.g., bookings per hotel)
        const hotelPerformance = hotels.map((hotel) => {
          const hotelBookings = bookings.filter((b) => b.hotelId === hotel._id);
          return {
            name: hotel.name,
            bookingsCount: hotelBookings.length,
            revenue: hotelBookings.reduce((sum, b) => {
              const price = Number(b.bookingPrice) || 0;
              return sum + price;
            }, 0),
          };
        });

        setReportData({ totalBookings, totalRevenue, hotelPerformance });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  const handleDateChange = (e) => {
    setDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  const generateCSV = () => {
    const headers = ["Hotel Name,Bookings Count,Revenue"];
    const rows = reportData.hotelPerformance.map(
      (hotel) => `${hotel.name},${hotel.bookingsCount},${hotel.revenue.toFixed(2)}`
    );
    const csvContent = [...headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "hotel_performance_report.csv");
    link.click();
  };

  if (loading) return <div className="text-center text-gray-600 text-xl font-semibold py-10">Loading...</div>;
  if (error) return <div className="text-center text-red-600 text-xl font-semibold py-10">{error}</div>;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h2>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            type="date"
            name="startDate"
            value={dateRange.startDate}
            onChange={handleDateChange}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            type="date"
            name="endDate"
            value={dateRange.endDate}
            onChange={handleDateChange}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900">Total Bookings</h3>
          <p className="text-2xl font-bold text-blue-600">{reportData.totalBookings}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-900">Total Revenue</h3>
          <p className="text-2xl font-bold text-green-600">${reportData.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Performance</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold">Hotel Name</th>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold">Bookings</th>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold">Revenue</th>
            </tr>
          </thead>
          <tbody>
            {reportData.hotelPerformance.map((hotel, index) => (
              <tr key={index} className="border-t">
                <td className="px-6 py-4 text-gray-700">{hotel.name}</td>
                <td className="px-6 py-4 text-gray-700">{hotel.bookingsCount}</td>
                <td className="px-6 py-4 text-gray-700">${hotel.revenue.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button
        onClick={generateCSV}
        className="mt-6 flex items-center gap-2 bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition font-semibold"
      >
        <FaDownload />
        Download Report (CSV)
      </button>
    </div>
  );
}

export default Reports;