import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <aside className="w-64 bg-indigo-900 text-white flex flex-col h-screen">
      {/* Sidebar Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">TraviGO ADMIN</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <NavLink
              to="/admin/hotel-listings"
              className={({ isActive }) =>
                `block p-4 hover:bg-pink-100 hover:text-black ${
                  isActive ? "bg-pink-100 text-black" : ""
                }`
              }
            >
              Hotel Listings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/vehicle-listings"
              className={({ isActive }) =>
                `block p-4 hover:bg-pink-100 hover:text-black ${
                  isActive ? "bg-pink-100 text-black" : ""
                }`
              }
            >
              Vehicle Listings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `block p-4 hover:bg-pink-100 hover:text-black ${
                  isActive ? "bg-pink-100 text-black" : ""
                }`
              }
            >
              Users
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reports"
              className={({ isActive }) =>
                `block p-4 hover:bg-pink-100 hover:text-black ${
                  isActive ? "bg-pink-100 text-black" : ""
                }`
              }
            >
              Reports
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/ui-manage"
              className={({ isActive }) =>
                `block p-4 hover:bg-pink-100 hover:text-black ${
                  isActive ? "bg-pink-100 text-black" : ""
                }`
              }
            >
              UI Manage
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Log Out Button */}
      <div className="p-6">
        <NavLink
          to="/logout"
          className="flex items-center space-x-2 p-4 hover:bg-pink-100 hover:text-black"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span>Log Out</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;