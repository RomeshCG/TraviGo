import { FaHome, FaCalendar, FaHistory, FaHotel, FaPlus, FaChartBar, FaSignOutAlt } from "react-icons/fa";

function Sidebar({ setActiveSection, handleLogout }) {
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <button
          onClick={() => setActiveSection("home")}
          className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
        >
          <FaHome className="text-blue-600" />
          Home
        </button>
        <button
          onClick={() => setActiveSection("incoming")}
          className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
        >
          <FaCalendar className="text-blue-600" />
          Incoming Bookings
        </button>
        <button
          onClick={() => setActiveSection("previous")}
          className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
        >
          <FaHistory className="text-blue-600" />
          Accepted Bookings
        </button>
        <button
          onClick={() => setActiveSection("details")}
          className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
        >
          <FaHotel className="text-blue-600" />
          Hotel Details
        </button>
        <button
          onClick={() => setActiveSection("add-hotel")}
          className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
        >
          <FaPlus className="text-blue-600" />
          Add Hotel
        </button>
        <button
          onClick={() => setActiveSection("reports")}
          className="w-full flex items-center gap-3 p-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition"
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