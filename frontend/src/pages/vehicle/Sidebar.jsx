const Sidebar = ({ setActiveSection, navigate }) => {
  const handleLogout = () => {
    localStorage.removeItem('provider');
    localStorage.removeItem('providerToken');
    navigate('/service-provider/login');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-semibold text-white">TraviGo</h2>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveSection('home')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition text-white"
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('incomingBookings')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition text-white"
            >
              Incoming Bookings
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('previousBookings')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition text-white"
            >
              Previous Bookings
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('reports')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition text-white"
            >
              Reports
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection('addVehicle')}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-700 transition text-white"
            >
              Add Vehicle
            </button>
          </li>
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;