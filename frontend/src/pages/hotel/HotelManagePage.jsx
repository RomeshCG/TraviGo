import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaTrash, FaSave, FaPlus } from "react-icons/fa";

const HotelManagePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    phone: "",
    email: "",
    image: "",
    imageArray: [],
    accommodationType: "",
    rooms: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`http://localhost:5000/api/hotels/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name || "",
            location: data.location || "",
            price: data.price || "",
            description: data.description || "",
            phone: data.phone || "",
            email: data.email || "",
            image: data.image || "",
            imageArray: data.imageArray || [],
            accommodationType: data.accommodationType || "",
            rooms: data.rooms || [],
          });
          const provider = JSON.parse(localStorage.getItem("provider"));
          if (provider && provider._id === data.providerId) setIsOwner(true);
        } else {
          setError(data.message || "Failed to fetch hotel");
        }
      } catch {
        setError("Server error. Please try again.");
      }
      setLoading(false);
    };
    fetchHotel();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("providerToken");
      const res = await fetch(`http://localhost:5000/api/hotels/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Hotel updated successfully!");
      } else {
        alert(data.message || "Failed to update hotel");
      }
    } catch {
      alert("Server error. Please try again.");
    }
  };

  const handleDeleteHotel = async () => {
    if (!window.confirm("Are you sure you want to delete this hotel? This action cannot be undone.")) return;
    try {
      const token = localStorage.getItem("providerToken");
      const res = await fetch(`http://localhost:5000/api/hotels/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Hotel deleted successfully!");
        navigate("/dashboard");
      } else {
        alert(data.message || "Failed to delete hotel");
      }
    } catch {
      alert("Server error. Please try again.");
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }
  if (error) {
    return <div className="text-center text-red-600 py-10">{error}</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto bg-gradient-to-br from-blue-50 to-white rounded-2xl shadow-2xl mt-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:underline font-semibold mr-4"
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="text-3xl font-bold text-gray-900 flex-1">Edit Hotel Details</h2>
      </div>
      <form onSubmit={handleSaveChanges} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="block font-medium mb-1">Hotel Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Accommodation Type</label>
            <input
              type="text"
              name="accommodationType"
              value={formData.accommodationType}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none min-h-[80px]"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block font-medium mb-1">Main Image URL</label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Main"
                className="w-40 h-28 object-cover rounded-lg mt-3 border"
              />
            )}
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <label className="block font-medium mb-1">Additional Images (comma separated URLs)</label>
            <input
              type="text"
              name="imageArray"
              value={formData.imageArray.join(",")}
              onChange={e =>
                setFormData({ ...formData, imageArray: e.target.value.split(",").map(s => s.trim()) })
              }
              className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.imageArray.map((img, idx) =>
                img ? (
                  <img
                    key={idx}
                    src={img}
                    alt={`Additional ${idx}`}
                    className="w-20 h-16 object-cover rounded border"
                  />
                ) : null
              )}
            </div>
          </div>
        </div>
        {/* Room editing can be added here if needed */}
        <div className="flex gap-4 mt-8 justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-semibold shadow transition"
          >
            <FaSave /> Save Changes
          </button>
          <button
            type="button"
            onClick={handleDeleteHotel}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 font-semibold shadow transition"
          >
            <FaTrash /> Delete Hotel
          </button>
        </div>
      </form>
    </div>
  );
};

export default HotelManagePage;

