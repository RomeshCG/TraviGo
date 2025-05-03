import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function HotelDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHotelDetails = async () => {
      if (!id) {
        setError("No hotel ID provided");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`http://localhost:5000/api/hotels/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch hotel details (status: ${response.status})`);
        }
        const data = await response.json();
        setDetails({
          name: data.name,
          address: data.location,
          phone: data.phone || "",
          email: data.email || "",
        });
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHotelDetails();
  }, [id]);

  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!id) {
      setError("No hotel ID provided for update");
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/hotels/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name,
          location: details.address,
          phone: details.phone,
          email: details.email,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to update hotel: ${errorData.message || response.status}`);
      }
      alert("Details updated successfully!");
      console.log("Updated details:", details);
    } catch (error) {
      console.error("Error updating details:", error);
      setError(error.message);
    }
  };

  if (loading) return <h2 className="text-center text-gray-600 text-2xl font-semibold py-10">Loading...</h2>;
  if (error) return <h2 className="text-center text-red-600 text-2xl font-semibold py-10">{error}</h2>;

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Hotel Details</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Hotel Name</label>
            <input
              type="text"
              name="name"
              value={details.name}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={details.address}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              value={details.phone}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={details.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-6 bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition font-semibold"
        >
          Update Details
        </button>
      </form>
    </div>
  );
}

export default HotelDetails;