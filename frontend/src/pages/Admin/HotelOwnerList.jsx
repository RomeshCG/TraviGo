import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";

const HotelOwnerList = () => {
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwners = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("/api/admin/hotel-owners", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch hotel owners");
        const data = await res.json();
        setOwners(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOwners();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Hotel Owners</h2>
            {loading ? (
              <div className="text-center py-10">Loading hotel owners...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : owners.length === 0 ? (
              <div className="text-center text-gray-500">No hotel owners found.</div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-5">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-indigo-100">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Registered</th>
                      <th className="p-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {owners.map((owner) => (
                      <tr key={owner._id} className="border-b hover:bg-gray-50">
                        <td className="p-2">{owner.name}</td>
                        <td className="p-2">{owner.email}</td>
                        <td className="p-2">{new Date(owner.createdAt).toLocaleDateString()}</td>
                        <td className="p-2">
                          <button
                            className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700"
                            onClick={() => navigate(`/admin/hotel-owners/${owner._id}`)}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelOwnerList;
