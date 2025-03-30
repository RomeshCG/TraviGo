import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [registrationToken, setRegistrationToken] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const authToken = localStorage.getItem('adminToken');
    if (!authToken) {
      navigate('/admin/login');
      return;
    }

    // Verify admin token
    fetch('/api/verify-admin-token', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message !== 'Token is valid') {
          navigate('/admin/login');
        }
      })
      .catch(() => navigate('/admin/login'));

    // Pre-fill registration token from sidebar
    if (location.state?.registrationToken) {
      setRegistrationToken(location.state.registrationToken);
    }
  }, [navigate, location]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email (e.g., admin@domain.com)';
    }
    if (password.length < 7) {
      newErrors.password = 'Password must be at least 7 characters';
    }
    if (!username) {
      newErrors.username = 'Username is required';
    }
    if (!registrationToken) {
      newErrors.registrationToken = 'Admin authorization token is required';
    }
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
      const response = await fetch('/api/admin/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        },
        body: JSON.stringify({ username, email, password, adminToken: registrationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'Registration successful!');
        setTimeout(() => navigate('/admin/login'), 2000);
      } else {
        throw new Error(data.message || 'Admin registration failed');
      }
    } catch (err) {
      setErrors({ submit: err.message || 'An error occurred during registration' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Admin Register</h1>
        {errors.submit && <p className="text-red-500 mb-4 text-center">{errors.submit}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.username ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="registrationToken">
              Admin Authorization Token
            </label>
            <input
              type="text"
              id="registrationToken"
              value={registrationToken}
              onChange={(e) => setRegistrationToken(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                errors.registrationToken ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {errors.registrationToken && <p className="text-red-500 text-sm mt-1">{errors.registrationToken}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;