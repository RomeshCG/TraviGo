import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("/api/admin/reports/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch dashboard stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-6 text-indigo-900">Admin Dashboard</h2>
            <div className="mb-8">
              <p className="text-lg text-gray-700">
                Welcome to the <span className="font-bold text-indigo-700">TraviGo Admin Dashboard</span>! Manage your tourism platform efficiently from here.
              </p>
            </div>
            {loading ? (
              <div className="text-center py-10">Loading dashboard...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : stats ? (
              <>
                {/* Modern Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                  <div className="p-6 bg-gradient-to-br from-indigo-500 to-pink-400 rounded-xl shadow-lg text-white flex flex-col items-center">
                    <h3 className="text-lg font-medium mb-2">System Income</h3>
                    <p className="text-3xl font-bold mb-1">${stats.systemIncome.toLocaleString()}</p>
                    <span className="text-sm opacity-80">Total platform income</span>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg text-white flex flex-col items-center">
                    <h3 className="text-lg font-medium mb-2">Total Users</h3>
                    <p className="text-3xl font-bold mb-1">{stats.totalUsers.toLocaleString()}</p>
                    <span className="text-sm opacity-80">Registered users</span>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-pink-500 to-yellow-400 rounded-xl shadow-lg text-white flex flex-col items-center">
                    <h3 className="text-lg font-medium mb-2">Hotel Bookings</h3>
                    <p className="text-3xl font-bold mb-1">{stats.totalHotelBookings.toLocaleString()}</p>
                    <span className="text-sm opacity-80">All time</span>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-500 to-teal-400 rounded-xl shadow-lg text-white flex flex-col items-center">
                    <h3 className="text-lg font-medium mb-2">Tour Bookings</h3>
                    <p className="text-3xl font-bold mb-1">{stats.totalTourBookings.toLocaleString()}</p>
                    <span className="text-sm opacity-80">All time</span>
                  </div>
                </div>
                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="p-5 bg-white rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-medium text-indigo-800 mb-1">Hotels</h3>
                    <p className="text-2xl font-bold text-indigo-900 mb-2">{stats.totalHotelBookings.toLocaleString()}</p>
                    <Link
                      to="/admin/hotel-listing"
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      View Hotels
                    </Link>
                  </div>
                  <div className="p-5 bg-white rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-medium text-indigo-800 mb-1">Vehicles</h3>
                    <p className="text-2xl font-bold text-indigo-900 mb-2">{stats.totalVehicleBookings?.toLocaleString() ?? 0}</p>
                    <Link
                      to="/admin/vehicle-listing"
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      View Vehicles
                    </Link>
                  </div>
                  <div className="p-5 bg-white rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-medium text-indigo-800 mb-1">Users</h3>
                    <p className="text-2xl font-bold text-indigo-900 mb-2">{stats.totalUsers.toLocaleString()}</p>
                    <Link
                      to="/admin/users"
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      View Users
                    </Link>
                  </div>
                </div>
                {/* More Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 bg-white rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-medium text-indigo-800 mb-1">Reports</h3>
                    <p className="text-gray-600 mb-2">See analytics and trends</p>
                    <Link
                      to="/admin/reports"
                      className="text-indigo-600 hover:text-indigo-800 font-semibold"
                    >
                      View Reports
                    </Link>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;