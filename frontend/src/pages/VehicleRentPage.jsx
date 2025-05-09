import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import MessageBox from '../components/MessageBox';
import Header from '../components/Header';

const VehicleRentPage = () => {
  const { state } = useLocation();
  const vehicle = state?.vehicle;
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login', { state: { from: '/rent' } });
      return;
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    email: '',
    phone: '',
    pickupLocation: '',
    paymentMethod: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [error, setError] = useState(null);

  if (!vehicle) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">No Vehicle Selected</h1>
          <Link
            to="/vehicles"
            className="text-blue-400 hover:text-blue-300 text-lg font-medium transition-colors duration-200"
          >
            ← Back to Vehicles
          </Link>
        </div>
      </div>
    );
  }

  const { name, price, _id } = vehicle;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^(\+\d{1,2}\s?)?(\(?\d{3}\)?[\s.-]?)\d{3}[\s.-]?\d{4}$/;
    return phoneRegex.test(phone);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!validateEmail(formData.email)) errors.email = 'Please enter a valid email address';
    if (!validatePhone(formData.phone)) errors.phone = 'Please enter a valid phone number (e.g., 123-456-7890)';
    if (!formData.pickupLocation.trim()) errors.pickupLocation = 'Pickup location is required';
    if (!formData.startDate) errors.startDate = 'Start date is required';
    if (!formData.endDate) errors.endDate = 'End date is required';
    else if (new Date(formData.endDate) < new Date(formData.startDate))
      errors.endDate = 'End date must be after start date';
    if (!formData.paymentMethod) errors.paymentMethod = 'Please select a payment method';

    return errors;
  };

  const handleChange = (e) => {
    const { name: fieldName, value } = e.target;
    setFormData((prev) => ({ ...prev, [fieldName]: value }));
  };

  const startDate = new Date(formData.startDate);
  const endDate = new Date(formData.endDate);
  const days =
    formData.startDate && formData.endDate && endDate >= startDate
      ? Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
      : 0;
  const totalPrice = days > 0 ? days * parseFloat(price) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setFormErrors({});

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    const rentalData = {
      vehicleId: _id,
      vehicleName: name,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      pickupLocation: formData.pickupLocation,
      startDate: formData.startDate,
      endDate: formData.endDate,
      totalPrice,
      paymentMethod: formData.paymentMethod,
    };

    try {
      const response = await fetch('/api/rent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(rentalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit rental request');
      }

      if (formData.paymentMethod === 'card') {
        navigate('/payment', { state: { totalPrice } });
      } else if (formData.paymentMethod === 'cash') {
        setShowMessageBox(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
    }
  };

  const handleCloseMessageBox = () => {
    setShowMessageBox(false);
    navigate('/vehicles');
  };

  return (
    <div className="min-h-screen bg-gray-800">
      <Header />
      <div className="pt-20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
          <Link
            to={`/vehicles/${_id}`}
            className="inline-flex items-center text-blue-600 hover:text-blue-800 text-lg font-medium transition-colors mb-6"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Vehicle Details
          </Link>

          <h1 className="text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
            Rent {name}
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg shadow-sm">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-lg ${
                    formErrors.name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {formErrors.name && <p className="mt-1 text-red-500 text-sm">{formErrors.name}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-lg ${
                    formErrors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {formErrors.email && <p className="mt-1 text-red-500 text-sm">{formErrors.email}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-lg ${
                    formErrors.phone ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {formErrors.phone && <p className="mt-1 text-red-500 text-sm">{formErrors.phone}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Pickup Location</label>
                <input
                  type="text"
                  name="pickupLocation"
                  value={formData.pickupLocation}
                  onChange={handleChange}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-lg ${
                    formErrors.pickupLocation ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {formErrors.pickupLocation && <p className="mt-1 text-red-500 text-sm">{formErrors.pickupLocation}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-lg ${
                    formErrors.startDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {formErrors.startDate && <p className="mt-1 text-red-500 text-sm">{formErrors.startDate}</p>}
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm text-lg ${
                    formErrors.endDate ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {formErrors.endDate && <p className="mt-1 text-red-500 text-sm">{formErrors.endDate}</p>}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Pricing Summary</h2>
              <div className="space-y-4 text-gray-700 text-lg">
                <p><strong className="font-medium">Price per Day:</strong> ${parseFloat(price).toFixed(2)}</p>
                <p><strong className="font-medium">Rental Days:</strong> {days || 'Select dates'}</p>
                <p className="text-gray-900 font-semibold text-xl">
                  <strong>Total Price:</strong> ${totalPrice.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Payment Method</h2>
              <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-8">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500 h-5 w-5"
                    required
                  />
                  <span className="text-gray-700 font-medium text-lg">Cash on Pickup</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={formData.paymentMethod === 'card'}
                    onChange={handleChange}
                    className="text-blue-600 focus:ring-blue-500 h-5 w-5"
                    required
                  />
                  <span className="text-gray-700 font-medium text-lg">Credit/Debit Card</span>
                </label>
              </div>
              {formErrors.paymentMethod && <p className="mt-2 text-red-500 text-sm">{formErrors.paymentMethod}</p>}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white text-lg font-semibold py-4 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50"
            >
              Submit Rental Request
            </button>
          </form>
        </div>

        {showMessageBox && (
          <MessageBox
            message="Your booking was successful! Please pay in cash upon pickup."
            totalPrice={totalPrice}
            onClose={handleCloseMessageBox}
          />
        )}
      </div>
    </div>
  );
};

export default VehicleRentPage;