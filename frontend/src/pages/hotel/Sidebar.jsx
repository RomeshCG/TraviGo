import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaCalendar, FaHistory, FaHotel, FaPlus, FaChartBar, FaSignOutAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";

function Sidebar({ setActiveSection, handleLogout }) {
  const [hotels, setHotels] = useState([]);
  const [showHotels, setShowHotels] = useState(false);

  useEffect(() => {
    // Fetch provider's hotels for the sidebar
    const token = localStorage.getItem("providerToken");
    if (!token) return;
    fetch("http://localhost:5000/api/hotels/provider", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setHotels(data);
        else if (Array.isArray(data.hotels)) setHotels(data.hotels);
      });
  }, []);

  // Optionally, track the active section for highlighting
  const [active, setActive] = useState("home");

  const handleSection = (section) => {
    setActive(section);
    setActiveSection(section);
  };

  return (
    <div className="w-64 min-h-screen bg-gradient-to-b from-blue-100 to-white shadow-xl flex flex-col">
      <div className="p-5 border-b">
        <h2 className="text-2xl font-extrabold text-blue-800 tracking-tight">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => handleSection("home")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition font-medium ${
            active === "home"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <FaHome className="text-blue-600" />
          Home
        </button>
        <button
          onClick={() => handleSection("incoming")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition font-medium ${
            active === "incoming"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <FaCalendar className="text-blue-600" />
          Incoming Bookings
        </button>
        <button
          onClick={() => handleSection("previous")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition font-medium ${
            active === "previous"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <FaHistory className="text-blue-600" />
          Accepted Bookings
        </button>
        <button
          onClick={() => setShowHotels((prev) => !prev)}
          className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-100 hover:text-blue-700 rounded-lg transition font-medium"
        >
          <FaHotel className="text-blue-600" />
          My Hotels
          {showHotels ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {showHotels && (
          <div className="ml-6 mt-2">
            {hotels.length === 0 ? (
              <div className="text-gray-400 text-sm">No hotels</div>
            ) : (
              hotels.map((hotel) => (
                <Link
                  key={hotel._id}
                  to={`/dashboard/hotel/${hotel._id}`}
                  className="block py-1 px-2 text-blue-700 hover:underline text-sm rounded hover:bg-blue-50"
                >
                  {hotel.name}
                </Link>
              ))
            )}
          </div>
        )}
        <button
          onClick={() => handleSection("add-hotel")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition font-medium ${
            active === "add-hotel"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <FaPlus className="text-blue-600" />
          Add Hotel
        </button>
        <button
          onClick={() => handleSection("reports")}
          className={`w-full flex items-center gap-3 p-3 rounded-lg transition font-medium ${
            active === "reports"
              ? "bg-blue-600 text-white"
              : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
          }`}
        >
          <FaChartBar className="text-blue-600" />
          Reports
        </button>
      </nav>
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-3 text-red-600 hover:bg-red-50 rounded-lg transition font-semibold"
        >
          <FaSignOutAlt className="text-red-600" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;