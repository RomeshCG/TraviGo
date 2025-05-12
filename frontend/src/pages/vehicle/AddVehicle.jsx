<<<<<<< HEAD
import React, { useState } from 'react';

const initialState = {
    vehicleType: '',
    vehicleName: '',
    location: '',
    pricePerDay: '',
    engine: '',
    seats: '',
    doors: '',
    fuelType: '',
    transmission: '',
    description: '',
    images: [],
};

const AddVehicle = () => {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);

    const validate = () => {
        const errs = {};
        if (!form.vehicleType) errs.vehicleType = 'Vehicle type is required';
        if (!form.vehicleName) errs.vehicleName = 'Vehicle name is required';
        if (!form.location) errs.location = 'Location is required';
        if (!form.pricePerDay || isNaN(form.pricePerDay)) errs.pricePerDay = 'Valid price per day is required';
        if (!form.engine) errs.engine = 'Engine is required';
        if (!form.seats || isNaN(form.seats)) errs.seats = 'Valid number of seats is required';
        if (!form.doors || isNaN(form.doors)) errs.doors = 'Valid number of doors is required';
        if (!form.fuelType) errs.fuelType = 'Fuel type is required';
        if (!form.transmission) errs.transmission = 'Transmission is required';
        if (!form.description) errs.description = 'Description is required';
        if (form.images.length === 0) errs.images = 'At least one image is required';
        return errs;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setForm({ ...form, images: files });
        setImagePreviews(files.map(file => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
        setLoading(true);
        try {
            const provider = JSON.parse(localStorage.getItem('provider'));
            const providerId = provider?._id;
            const formData = new FormData();
            formData.append('providerId', providerId);
            Object.keys(form).forEach(key => {
                if (key === 'images') {
                    form.images.forEach(img => formData.append('images', img));
                } else {
                    formData.append(key, form[key]);
                }
            });
            const res = await fetch('http://localhost:5000/api/renting-vehicles/add', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (res.ok) {
                setSuccess('Vehicle added successfully!');
                setForm(initialState);
                setImagePreviews([]);
            } else {
                setErrors({ api: data.message || 'Failed to add vehicle' });
            }
        } catch (err) {
            setErrors({ api: 'Server error. Please try again.' });
        }
        setLoading(false);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">Add New Vehicle</h2>
            <div className="bg-white rounded shadow p-6">
                {success && <div className="mb-4 text-green-600 font-semibold">{success}</div>}
                {errors.api && <div className="mb-4 text-red-600 font-semibold">{errors.api}</div>}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block mb-1 font-semibold">Vehicle Type</label>
                            <input name="vehicleType" value={form.vehicleType} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="e.g. Car, Van, Bus" />
                            {errors.vehicleType && <span className="text-red-500 text-sm">{errors.vehicleType}</span>}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Vehicle Name</label>
                            <input name="vehicleName" value={form.vehicleName} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Enter vehicle name" />
                            {errors.vehicleName && <span className="text-red-500 text-sm">{errors.vehicleName}</span>}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Location</label>
                            <input name="location" value={form.location} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Location" />
                            {errors.location && <span className="text-red-500 text-sm">{errors.location}</span>}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Price Per Day</label>
                            <input name="pricePerDay" value={form.pricePerDay} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Price per day" type="number" min="0" />
                            {errors.pricePerDay && <span className="text-red-500 text-sm">{errors.pricePerDay}</span>}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Engine</label>
                            <input name="engine" value={form.engine} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Engine" />
                            {errors.engine && <span className="text-red-500 text-sm">{errors.engine}</span>}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Seats</label>
                            <input name="seats" value={form.seats} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Seats" type="number" min="1" />
                            {errors.seats && <span className="text-red-500 text-sm">{errors.seats}</span>}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Doors</label>
                            <input name="doors" value={form.doors} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Doors" type="number" min="1" />
                            {errors.doors && <span className="text-red-500 text-sm">{errors.doors}</span>}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Fuel Type</label>
                            <input name="fuelType" value={form.fuelType} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Fuel type" />
                            {errors.fuelType && <span className="text-red-500 text-sm">{errors.fuelType}</span>}
                        </div>
                        <div>
                            <label className="block mb-1 font-semibold">Transmission</label>
                            <input name="transmission" value={form.transmission} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Transmission" />
                            {errors.transmission && <span className="text-red-500 text-sm">{errors.transmission}</span>}
                        </div>
                    </div>
                    <div className="mt-4">
                        <label className="block mb-1 font-semibold">Description</label>
                        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border rounded px-3 py-2" placeholder="Description" rows={3} />
                        {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                    </div>
                    <div className="mt-4">
                        <label className="block mb-1 font-semibold">Images (up to 5)</label>
                        <input type="file" name="images" accept="image/*" multiple onChange={handleImageChange} className="w-full" />
                        {errors.images && <span className="text-red-500 text-sm block">{errors.images}</span>}
                        <div className="flex flex-wrap gap-2 mt-2">
                            {imagePreviews.map((src, idx) => (
                                <img key={idx} src={src} alt="preview" className="w-20 h-20 object-cover rounded border" />
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="mt-6 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Vehicle'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddVehicle; 
=======
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
    } catch {
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
>>>>>>> 5b99cf354ee2fc09fa1883909b905f8304b58100
