import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '../../components/AdminHeader'; // Adjust path as needed
import Footer from '../../components/Footer'; // Adjust path as needed
import backgroundImage from '../../assets/login_page_img.jpg'; // Adjust path as needed

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!username) newErrors.username = 'Username is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    if (!validateForm()) return;

    try {
      const authToken = localStorage.getItem('adminToken');
      if (!authToken) {
        setErrors({ submit: 'You must be logged in as an admin to register a new admin' });
        return;
      }

      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Admin registered successfully!');
        setTimeout(() => navigate('/admin/dashboard'), 2000); // Redirect to dashboard
      } else {
        throw new Error(data.message || 'Admin registration failed');
      }
    } catch (err) {
      setErrors({ submit: err.message || 'An error occurred during registration' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        }}
      >
        <div className="admin-register flex flex-col lg:flex-row items-center justify-between w-full max-w-5xl p-6">
          <div className="text-white mb-8 lg:mb-0 lg:w-1/2">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Register New Admin</h2>
            <p className="text-lg">
              Add a new admin to manage your platform securely and efficiently.
            </p>
          </div>
          <form
            onSubmit={handleRegister}
            className="bg-white bg-opacity-90 rounded-lg p-8 w-full max-w-md"
          >
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Username"
              />
              {errors.username && (
                <span className="error text-red-500 text-sm mt-1">{errors.username}</span>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Email"
              />
              {errors.email && (
                <span className="error text-red-500 text-sm mt-1">{errors.email}</span>
              )}
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Password"
              />
              {errors.password && (
                <span className="error text-red-500 text-sm mt-1">{errors.password}</span>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
            >
              Register
            </button>
            {errors.submit && (
              <span className="error text-red-500 text-center block mt-4">{errors.submit}</span>
            )}
            {success && (
              <span className="success text-green-500 text-center block mt-4">{success}</span>
            )}
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminRegister;