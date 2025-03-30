import React, { useState, useEffect } from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';

const EditProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    country: '',
    address: '',
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser || !storedUser._id) {
          throw new Error('User not found in local storage');
        }

        const response = await fetch(`/api/user/${storedUser._id}`);
        const data = await response.json();

        if (response.ok) {
          setUser(data);
          setFormData({
            email: data.email,
            phoneNumber: data.phoneNumber,
            country: data.country,
            address: data.address || '',
          });
        } else {
          throw new Error(data.message || 'Failed to fetch user data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser._id) {
        throw new Error('User not found in local storage');
      }

      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: storedUser._id,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          country: formData.country,
          address: formData.address,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        // Update localStorage with the new user data
        const updatedUser = { ...storedUser, ...data.user };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(data.user);
      } else {
        throw new Error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while updating the profile');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
        <SidebarUser />
        <div className="flex-1">
          <HeaderUser />
          <div className="p-6 md:p-10 flex items-center justify-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
        <SidebarUser />
        <div className="flex-1">
          <HeaderUser />
          <div className="p-6 md:p-10 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      <SidebarUser />
      <div className="flex-1">
        <HeaderUser />
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">Edit Profile</h1>
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8">
            {success && <p className="text-green-600 mb-4">{success}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={user.username}
                  className="w-full p-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="phoneNumber">
                  Phone
                </label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="country">
                  Country
                </label>
                <input
                  type="text"
                  id="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="address">
                  Address
                </label>
                <textarea
                  id="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;