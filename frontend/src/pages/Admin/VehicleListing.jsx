import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";

const VehicleListing = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("http://localhost:5000/api/renting-vehicles");
        const data = await res.json();
        if (res.ok) {
          setVehicles(data.vehicles || []);
        } else {
          setError(data.message || "Failed to fetch vehicles");
        }
      } catch {
        setError("Server error. Please try again.");
      }
      setLoading(false);
    };
    fetchVehicles();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this vehicle?")) return;
    setDeleteLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/renting-vehicles/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setVehicles((prev) => prev.filter((v) => v._id !== id));
      } else {
        alert(data.message || "Failed to delete vehicle");
      }
    } catch {
      alert("Server error. Please try again.");
    }
    setDeleteLoading(false);
  };

  const handleView = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowModal(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Vehicle Listing</h2>
            {loading ? (
              <div className="text-blue-700">Loading vehicles...</div>
            ) : error ? (
              <div className="text-red-600">{error}</div>
            ) : vehicles.length === 0 ? (
              <div className="text-gray-600">No vehicles found.</div>
            ) : (
              <div className="space-y-4">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle._id}
                    className="flex items-center justify-between p-4 bg-pink-50 rounded-lg shadow-md"
                  >
                    <div>
                      <span className="text-lg font-medium">{vehicle.vehicleName}</span>
                      <p className="text-sm text-gray-600">
                        Type: {vehicle.vehicleType} | Year: {vehicle.year || "-"} | Location: {vehicle.location}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <button
                        onClick={() => handleView(vehicle)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleDelete(vehicle._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Vehicle Details Modal */}
      {showModal && selectedVehicle && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(30,41,59,0.15)", backdropFilter: "blur(2px)" }}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h3 className="text-xl font-bold mb-4">Vehicle Details</h3>
            <div className="space-y-2">
              <div><strong>Name:</strong> {selectedVehicle.vehicleName}</div>
              <div><strong>Type:</strong> {selectedVehicle.vehicleType}</div>
              <div><strong>Location:</strong> {selectedVehicle.location}</div>
              <div><strong>Price Per Day:</strong> ${selectedVehicle.pricePerDay}</div>
              <div><strong>Engine:</strong> {selectedVehicle.engine}</div>
              <div><strong>Seats:</strong> {selectedVehicle.seats}</div>
              <div><strong>Doors:</strong> {selectedVehicle.doors}</div>
              <div><strong>Fuel Type:</strong> {selectedVehicle.fuelType}</div>
              <div><strong>Transmission:</strong> {selectedVehicle.transmission}</div>
              <div><strong>Description:</strong> {selectedVehicle.description}</div>
              {selectedVehicle.images && selectedVehicle.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedVehicle.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.startsWith("http") ? img : `/uploads/${img}`}
                      alt="Vehicle"
                      className="w-24 h-16 object-cover rounded border"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleListing;