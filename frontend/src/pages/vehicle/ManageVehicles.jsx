import React, { useEffect, useState } from 'react';

const ManageVehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingVehicle, setEditingVehicle] = useState(null); // State for editing a vehicle
    const [formData, setFormData] = useState({
        vehicleName: '',
        vehicleType: '',
        pricePerDay: '',
        location: '',
        description: '',
    });

    useEffect(() => {
        const fetchVehicles = async () => {
            setLoading(true);
            setError('');
            try {
                const token = localStorage.getItem('providerToken');
                const res = await fetch('http://localhost:5000/api/renting-vehicles', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();

                if (res.ok) {
                    // Filter vehicles owned by the logged-in provider
                    const providerId = JSON.parse(localStorage.getItem('provider'))._id;
                    const ownedVehicles = data.vehicles.filter(
                        (vehicle) => vehicle.providerId === providerId
                    );
                    setVehicles(ownedVehicles);
                } else {
                    setError(data.message || 'Failed to fetch vehicles');
                }
            } catch {
                setError('Server error. Please try again.');
            }
            setLoading(false);
        };

        fetchVehicles();
    }, []);

    const handleEditClick = (vehicle) => {
        setEditingVehicle(vehicle);
        setFormData({
            vehicleName: vehicle.vehicleName,
            vehicleType: vehicle.vehicleType,
            pricePerDay: vehicle.pricePerDay,
            location: vehicle.location,
            description: vehicle.description,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('providerToken');
            const res = await fetch(`http://localhost:5000/api/renting-vehicles/${editingVehicle._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();

            if (res.ok) {
                // Update the vehicle in the list
                setVehicles((prevVehicles) =>
                    prevVehicles.map((vehicle) =>
                        vehicle._id === editingVehicle._id ? { ...vehicle, ...formData } : vehicle
                    )
                );
                setEditingVehicle(null);
                alert('Vehicle updated successfully!');
            } else {
                alert(data.message || 'Failed to update vehicle');
            }
        } catch {
            alert('Server error. Please try again.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-lg text-blue-700 font-medium">Loading vehicles...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="text-lg text-red-600 font-medium">{error}</span>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Manage Vehicles</h2>
            <div className="bg-white rounded shadow p-6">
                {editingVehicle ? (
                    <form onSubmit={handleSaveChanges} className="space-y-4">
                        <div>
                            <label className="block font-medium">Vehicle Name</label>
                            <input
                                type="text"
                                name="vehicleName"
                                value={formData.vehicleName}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Vehicle Type</label>
                            <input
                                type="text"
                                name="vehicleType"
                                value={formData.vehicleType}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Price Per Day</label>
                            <input
                                type="number"
                                name="pricePerDay"
                                value={formData.pricePerDay}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Location</label>
                            <input
                                type="text"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <div>
                            <label className="block font-medium">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full border rounded px-3 py-2"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            Save Changes
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingVehicle(null)}
                            className="ml-4 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </form>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr>
                                <th className="text-left py-2">Vehicle Name</th>
                                <th className="text-left py-2">Type</th>
                                <th className="text-left py-2">Price Per Day</th>
                                <th className="text-left py-2">Location</th>
                                <th className="text-left py-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {vehicles.map((vehicle) => (
                                <tr key={vehicle._id}>
                                    <td className="py-2">{vehicle.vehicleName}</td>
                                    <td className="py-2">{vehicle.vehicleType}</td>
                                    <td className="py-2">${vehicle.pricePerDay}</td>
                                    <td className="py-2">{vehicle.location}</td>
                                    <td className="py-2">
                                        <button
                                            className="text-blue-600"
                                            onClick={() => handleEditClick(vehicle)}
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default ManageVehicles;