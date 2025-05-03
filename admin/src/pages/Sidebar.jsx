import { FaCalendar, FaHistory, FaHotel, FaPlus } from "react-icons/fa";

function Sidebar({ setActiveSection, handleLogout }) {
  return (
    <div className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
      </div>
      <nav className="flex-1 p-4">
        <button
          onClick={() => setActiveSection("incoming")}
          className="w-full flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-100 rounded-md mb-2"
        >
          <FaCalendar className="text-blue-600" />
          Incoming Bookings
        </button>
        <button
          onClick={() => setActiveSection("previous")}
          className="w-full flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-100 rounded-md mb-2"
        >
          <FaHistory className="text-blue-600" />
          Previous Bookings
        </button>
        <button
          onClick={() => setActiveSection("details")}
          className="w-full flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-100 rounded-md mb-2"
        >
          <FaHotel className="text-blue-600" />
          Hotel Details
        </button>
        <button
          onClick={() => setActiveSection("add-hotel")}
          className="w-full flex items-center gap-2 p-3 text-gray-700 hover:bg-gray-100 rounded-md mb-2"
        >
          <FaPlus className="text-blue-600" />
          Add Hotel
        </button>
      </nav>
    </div>
  );
}

export default Sidebar;