import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaHotel, FaCar, FaUserTie, FaUsers, FaChartBar, FaPaintBrush, FaSignOutAlt, FaTachometerAlt } from "react-icons/fa";

const SidebarAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return "A";
    const nameParts = name.trim().split(" ");
    if (nameParts.length < 2) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    const firstInitial = nameParts[0].charAt(0).toUpperCase();
    const lastInitial = nameParts[nameParts.length - 1].charAt(0).toUpperCase();
    return `${firstInitial}${lastInitial}`;
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    setIsOpen(false);
    navigate('/admin/login');
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-indigo-900 text-white rounded-lg"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        {isOpen ? "Close" : "Menu"}
      </button>
      {/* Sidebar */}
      <aside
        className={`w-64 bg-indigo-900 text-white flex flex-col fixed md:static top-16 md:top-0 h-[calc(100vh-4rem)] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } z-40`}
        aria-hidden={!isOpen}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold">TraviGo</h1>
          <div className="mt-4 flex items-center space-x-3">
            {admin?.profilePhoto ? (
              <img
                src={admin.profilePhoto}
                alt="Admin Profile"
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center text-white text-lg font-medium">
                {getInitials(admin?.username)}
              </div>
            )}
            <div>
              <p className="text-lg font-medium">{admin?.username || "Admin"}</p>
              <p className="text-sm text-gray-400">Admin</p>
            </div>
          </div>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-4 hover:bg-pink-100 hover:text-black ${
                    isActive ? "bg-pink-100 text-black" : ""
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaTachometerAlt className="w-5 h-5" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/hotel-listing"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-4 hover:bg-pink-100 hover:text-black ${
                    isActive ? "bg-pink-100 text-black" : ""
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaHotel className="w-5 h-5" />
                <span>Hotel Listing</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/vehicle-listing"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-4 hover:bg-pink-100 hover:text-black ${
                    isActive ? "bg-pink-100 text-black" : ""
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaCar className="w-5 h-5" />
                <span>Vehicle Listing</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/tour-guides"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-4 hover:bg-pink-100 hover:text-black ${
                    isActive ? "bg-pink-100 text-black" : ""
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaUserTie className="w-5 h-5" />
                <span>Tour Guides</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-4 hover:bg-pink-100 hover:text-black ${
                    isActive ? "bg-pink-100 text-black" : ""
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaUsers className="w-5 h-5" />
                <span>Users</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/reports"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-4 hover:bg-pink-100 hover:text-black ${
                    isActive ? "bg-pink-100 text-black" : ""
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaChartBar className="w-5 h-5" />
                <span>Reports</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/ui-manager"
                className={({ isActive }) =>
                  `flex items-center space-x-2 p-4 hover:bg-pink-100 hover:text-black ${
                    isActive ? "bg-pink-100 text-black" : ""
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                <FaPaintBrush className="w-5 h-5" />
                <span>UI Manager</span>
              </NavLink>
            </li>
          </ul>
        </nav>
        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 p-4 w-full text-left hover:bg-pink-100 hover:text-black"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default SidebarAdmin;