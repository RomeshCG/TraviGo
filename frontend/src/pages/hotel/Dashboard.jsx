import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Sidebar from "./Sidebar";
import Home from "./Home";
import IncomingBookings from "./IncomingBookings";
import PreviousBookings from "./PreviousBookings";
import HotelDetails from "./HotelDetails";
import AddHotel from "./AddHotel";
import Reports from "./Reports";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [activeSection, setActiveSection] = useState("home");
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [error, setError] = useState(null);
  const [provider, setProvider] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initializeDashboard = async () => {
      setVerifying(true);
      const token = localStorage.getItem("providerToken");
      const storedProvider = localStorage.getItem("provider");

      if (!token || !storedProvider) {
        setError("No provider data found. Please log in again.");
        setVerifying(false);
        navigate("/service-provider/login");
        return;
      }

      try {
        const providerData = JSON.parse(storedProvider);
        if (!providerData?.providerType || providerData.providerType !== "HotelProvider") {
          setError("Unauthorized access. Please log in as a Hotel Provider.");
          setVerifying(false);
          navigate("/service-provider/login");
          return;
        }

        // Verify token
        const verifyResponse = await fetch("/api/verify-provider-token", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!verifyResponse.ok) {
          throw new Error("Invalid or expired token");
        }

        setProvider(providerData);

        // Fetch provider-specific hotels
        setLoading(true);
        const hotelsResponse = await fetch("http://localhost:5000/api/hotels/provider", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!hotelsResponse.ok) {
          throw new Error(`Failed to fetch hotels (status: ${hotelsResponse.status})`);
        }
        const hotelsData = await hotelsResponse.json();
        setHotels(hotelsData);
      } catch (err) {
        console.error("Initialization error:", err);
        setError(err.message || "Session expired. Please log in again.");
        localStorage.removeItem("providerToken");
        localStorage.removeItem("provider");
        navigate("/service-provider/login");
      } finally {
        setLoading(false);
        setVerifying(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("providerToken");
    localStorage.removeItem("provider");
    navigate("/service-provider/login");
  };

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return <Home />;
      case "incoming":
        return <IncomingBookings />;
      case "previous":
        return <PreviousBookings />;
      case "details":
        if (verifying || loading) {
          return <div className="text-center text-gray-600 text-xl font-semibold py-10">Loading...</div>;
        }
        if (error) {
          return <div className="text-center text-red-600 text-xl font-semibold py-10">{error}</div>;
        }
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

  if (error && !verifying) {
    return <div className="text-center text-red-600 text-xl font-semibold py-10">{error}</div>;
  }

  if (verifying) {
    return <div className="text-center text-gray-600 text-xl font-semibold py-10">Verifying...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar setActiveSection={setActiveSection} handleLogout={handleLogout} />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Grand Horizons Dashboard</h1>
          {provider && (
            <div className="flex items-center space-x-4">
              <div className="text-gray-700">
                <p className="font-semibold">{provider.name}</p>
                <p className="text-sm">{provider.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition font-semibold"
              >
                Logout
              </button>
            </div>
          )}
        </header>
        <main className="flex-1 p-8 overflow-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Welcome, {provider ? provider.name : "Hotel Manager"}!
            </h2>
            <p className="text-gray-600 mt-2">Manage your bookings, hotels, and generate reports with ease.</p>
          </div>
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

export default Dashboard;