import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import IncomingBookings from "./IncomingBookings";
import PreviousBookings from "./PreviousBookings";
import HotelDetails from "./HotelDetails";
import AddHotel from "./AddHotel";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("incoming");
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
      case "incoming":
        return <IncomingBookings />;
      case "previous":
        return <PreviousBookings />;
      case "details":
        if (loading) return <h2 className="text-center text-gray-600 text-2xl font-semibold py-10">Loading...</h2>;
        if (error) return <h2 className="text-center text-red-600 text-2xl font-semibold py-10">{error}</h2>;
        return (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Manage Hotels</h2>
            {hotels.length === 0 ? (
              <p className="text-gray-600">No hotels available.</p>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6">
                <ul>
                  {hotels.map((hotel) => (
                    <li key={hotel._id} className="mb-2">
                      <Link
                        to={`/dashboard/hotel/${hotel._id}`}
                        className="text-blue-600 hover:underline"
                      >
                        {hotel.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      case "add-hotel":
        return <AddHotel />;
      default:
        return <IncomingBookings />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar setActiveSection={setActiveSection} handleLogout={logout} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Grand Horizons Dashboard</h1>
          <button
            onClick={logout}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Logout
          </button>
        </header>
        <main className="flex-1 p-6 overflow-auto">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Welcome, Hotel Manager!</h2>
            <p className="text-gray-600">Manage your bookings and hotel details efficiently.</p>
          </div>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;