import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Home from "./Home";
import IncomingBookings from "./IncomingBookings";
import PreviousBookings from "./PreviousBookings";
import HotelDetails from "./HotelDetails";
import AddHotel from "./AddHotel";
import Reports from "./Reports";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("home");
  const { logout } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/hotels");
        if (!response.ok) {
          throw new Error(`Failed to fetch hotels (status: ${response.status})`);
        }
        const data = await response.json();
        setHotels(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <Home />;
      case "incoming":
        return <IncomingBookings />;
      case "previous":
        return <PreviousBookings />;
      case "details":
        if (loading) return <div className="text-center text-gray-600 text-xl font-semibold py-10">Loading...</div>;
        if (error) return <div className="text-center text-red-600 text-xl font-semibold py-10">{error}</div>;
        return (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Hotels</h2>
            {hotels.length === 0 ? (
              <p className="text-gray-600">No hotels available.</p>
            ) : (
              <ul className="space-y-4">
                {hotels.map((hotel) => (
                  <li key={hotel._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                    <Link to={`/dashboard/hotel/${hotel._id}`} className="text-blue-600 hover:underline font-medium">
                      {hotel.name}
                    </Link>
                    <span className="text-gray-500 text-sm">{hotel.location}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      case "add-hotel":
        return <AddHotel />;
      case "reports":
        return <Reports />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar setActiveSection={setActiveSection} handleLogout={logout} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4">
          <h1 className="text-2xl font-bold text-gray-900">Grand Horizons Dashboard</h1>
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome, Hotel Manager!</h2>
            <p className="text-gray-600 mt-2">Manage your bookings, hotels, and generate reports with ease.</p>
          </div>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;