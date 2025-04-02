import { Link } from "react-router-dom";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";

const AdminDashboard = () => {
  const stats = {
    totalHotels: 25,
    totalVehicles: 15,
    totalUsers: 120,
    totalReports: 8,
    uiElements: 5,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
            <div className="mb-8">
              <p className="text-lg text-gray-700">
                Welcome to the TraviGo Admin Dashboard! Manage your tourism platform efficiently from here.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800">Hotels</h3>
                <p className="text-2xl font-bold text-indigo-900">{stats.totalHotels}</p>
                <Link
                  to="/admin/hotel-listing"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Hotels
                </Link>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800">Vehicles</h3>
                <p className="text-2xl font-bold text-indigo-900">{stats.totalVehicles}</p>
                <Link
                  to="/admin/vehicle-listing"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Vehicles
                </Link>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800">Users</h3>
                <p className="text-2xl font-bold text-indigo-900">{stats.totalUsers}</p>
                <Link
                  to="/admin/users"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Users
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800">Reports</h3>
                <p className="text-gray-600">Total Reports: {stats.totalReports}</p>
                <Link
                  to="/admin/reports"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  View Reports
                </Link>
              </div>
              <div className="p-4 bg-white rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-800">UI Management</h3>
                <p className="text-gray-600">UI Elements: {stats.uiElements}</p>
                <Link
                  to="/admin/ui-manager"
                  className="text-indigo-600 hover:text-indigo-800"
                >
                  Manage UI
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;