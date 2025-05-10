import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";

const HotelListing = () => {
  const [hotelsByOwner, setHotelsByOwner] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("adminToken");
        // Fetch all hotels with owner info
        const res = await fetch("/api/admin/hotels", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch hotels");
        const data = await res.json();
        // Group hotels by owner
        const grouped = {};
        data.forEach((hotel) => {
          const owner = hotel.owner || { hotelName: "Unknown Owner" };
          if (!grouped[owner.hotelName]) grouped[owner.hotelName] = [];
          grouped[owner.hotelName].push(hotel);
        });
        setHotelsByOwner(Object.entries(grouped));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const handleUpdate = (id) => {
    // Implement update logic (e.g., open modal)
    alert(`Update hotel ${id}`);
  };

  const handleDelete = (id) => {
    // Implement delete logic (e.g., confirmation and API call)
    alert(`Delete hotel ${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Hotel Listing</h2>
            {loading ? (
              <div className="text-center py-10">Loading hotels...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : hotelsByOwner.length === 0 ? (
              <div className="text-center text-gray-500">No hotels found.</div>
            ) : (
              hotelsByOwner.map(([ownerName, hotels]) => (
                <div key={ownerName} className="mb-8">
                  <h3 className="text-xl font-semibold mb-4 text-indigo-700 flex items-center">
                    <span className="bg-indigo-100 px-3 py-1 rounded-lg mr-2">{ownerName}</span>
                    <span className="text-sm text-gray-500">({hotels.length} hotel{hotels.length > 1 ? 's' : ''})</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                      <div
                        key={hotel._id}
                        className="bg-white rounded-xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition"
                      >
                        <div className="mb-3">
                          <img
                            src={hotel.image || 'https://via.placeholder.com/300x180?text=No+Image'}
                            alt={hotel.name}
                            className="w-full h-40 object-cover rounded-lg mb-3 border"
                          />
                          <h4 className="text-lg font-bold text-gray-800 mb-1">{hotel.name}</h4>
                          <p className="text-sm text-gray-600 mb-1">Location: <span className="font-medium">{hotel.location}</span></p>
                          <p className="text-sm text-gray-600 mb-1">Price: <span className="font-medium">${hotel.price}</span></p>
                          <p className="text-sm text-gray-600 mb-1">Rooms: <span className="font-medium">{hotel.rooms?.length || 0}</span></p>
                          <p className="text-sm text-gray-600 mb-1">Contact: <span className="font-medium">{hotel.phone || 'N/A'}</span></p>
                          <p className="text-sm text-gray-600 mb-1">Email: <span className="font-medium">{hotel.email || 'N/A'}</span></p>
                        </div>
                        <div className="flex gap-2 mt-auto">
                          <button
                            onClick={() => handleUpdate(hotel._id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                          >
                            Update
                          </button>
                          <button
                            onClick={() => handleDelete(hotel._id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelListing;