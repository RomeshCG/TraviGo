import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";

const HotelOwnerDetails = () => {
  const { id } = useParams();
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOwner = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch(`/api/admin/hotel-owners/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch hotel owner details");
        const data = await res.json();
        setOwner(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOwner();
  }, [id]);

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-2xl mx-auto">
            <button
              className="mb-4 text-indigo-600 hover:underline"
              onClick={() => navigate(-1)}
            >
              &larr; Back to Owners List
            </button>
            <h2 className="text-2xl font-bold mb-6">Hotel Owner Details</h2>
            {loading ? (
              <div className="text-center py-10">Loading owner details...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : !owner ? (
              <div className="text-center text-gray-500">Owner not found.</div>
            ) : (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h3 className="text-xl font-semibold mb-2">{owner.name}</h3>
                <p className="mb-1"><span className="font-medium">Email:</span> {owner.email}</p>
                <p className="mb-1"><span className="font-medium">Registered:</span> {new Date(owner.createdAt).toLocaleDateString()}</p>
                {/* Add more fields as needed */}
                {owner.hotels && owner.hotels.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Hotels Owned:</h4>
                    <ul className="list-disc ml-6">
                      {owner.hotels.map((hotel) => (
                        <li key={hotel._id}>{hotel.name} ({hotel.location})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelOwnerDetails;
