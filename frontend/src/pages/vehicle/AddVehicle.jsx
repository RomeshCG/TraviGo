import { useState } from 'react';
import axios from 'axios';

const AddVehicle = ({ providerId, setError }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    price: '',
    engine: '',
    doors: '',
    seats: '',
    fuel: '',
    transmission: '',
    description: '',
    images: [],
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData({ ...formData, images: files });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === 'images') {
        formData.images.forEach((image) => data.append('images', image));
      } else {
        data.append(key, formData[key]);
      }
    });
    data.append('providerId', providerId);

    try {
      await axios.post('http://localhost:5000/api/vehicles', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Vehicle added successfully!');
      setFormData({
        name: '',
        location: '',
        price: '',
        engine: '',
        doors: '',
        seats: '',
        fuel: '',
        transmission: '',
        description: '',
        images: [],
      });
    } catch (err) {
      setError('Failed to add vehicle. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Add New Vehicle</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-lg">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Vehicle Name"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Location"
          className="p-2 border rounded"
          required
        />
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price per Day"
          className="p-2 border rounded"
          required
          min="0"
        />
        <input
          type="text"
          name="engine"
          value={formData.engine}
          onChange={handleChange}
          placeholder="Engine"
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="doors"
          value={formData.doors}
          onChange={handleChange}
          placeholder="Doors"
          className="p-2 border rounded"
          min="1"
        />
        <input
          type="number"
          name="seats"
          value={formData.seats}
          onChange={handleChange}
          placeholder="Seats"
          className="p-2 border rounded"
          min="1"
        />
        <input
          type="text"
          name="fuel"
          value={formData.fuel}
          onChange={handleChange}
          placeholder="Fuel Type"
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="transmission"
          value={formData.transmission}
          onChange={handleChange}
          placeholder="Transmission"
          className="p-2 border rounded"
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-2 border rounded"
          rows="4"
        />
        <input
          type="file"
          multiple
          onChange={handleImageUpload}
          className="p-2 border rounded"
          accept="image/*"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Adding...' : 'Add Vehicle'}
        </button>
      </form>
    </div>
  );
};

export default AddVehicle;