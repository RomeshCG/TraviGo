import React, { useState, useEffect } from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';
import { FaUser, FaEnvelope, FaPhone, FaGlobe, FaMapMarkerAlt, FaUniversity, FaIdCard, FaCodeBranch, FaKey } from 'react-icons/fa';

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
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    branch: '',
    swiftCode: '',
  });
  const [bankSuccess, setBankSuccess] = useState('');
  const [bankError, setBankError] = useState('');

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
          if (data.bankDetails && data.bankDetails.accountHolderName) {
            setBankDetails({
              accountHolderName: data.bankDetails.accountHolderName || '',
              bankName: data.bankDetails.bankName || '',
              accountNumber: data.bankDetails.accountNumber || '',
              branch: data.bankDetails.branch || '',
              swiftCode: data.bankDetails.swiftCode || '',
            });
          } else {
            setBankDetails({
              accountHolderName: '',
              bankName: '',
              accountNumber: '',
              branch: '',
              swiftCode: '',
            });
          }
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

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

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

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setBankError('');
    setBankSuccess('');
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser._id) {
        throw new Error('User not found in local storage');
      }
      const response = await fetch('/api/user/update-bank-details', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: storedUser._id, bankDetails }),
      });
      const data = await response.json();
      if (response.ok) {
        setBankSuccess('Bank details updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update bank details');
      }
    } catch (err) {
      setBankError(err.message || 'An error occurred while updating bank details');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
        <SidebarUser />
        <div style={{ marginLeft: 'var(--sidebar-width, 16rem)' }} className="flex-1">
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
        <div style={{ marginLeft: 'var(--sidebar-width, 16rem)' }} className="flex-1">
          <HeaderUser />
          <div className="p-6 md:p-10 flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex">
      <SidebarUser />
      <div style={{ marginLeft: 'var(--sidebar-width, 16rem)' }} className="flex-1 flex flex-col">
        <HeaderUser />
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-10 border border-blue-100">
            <h1 className="text-3xl font-extrabold text-blue-900 mb-8 text-center">Edit Profile</h1>
            {success && <p className="text-green-600 mb-4 text-center">{success}</p>}
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="username">
                  Username
                </label>
                <div className="flex items-center">
                  <FaUser className="absolute ml-3 text-gray-400" />
                  <input
                    type="text"
                    id="username"
                    value={user.username}
                    className="w-full pl-10 p-3 border rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
                    disabled
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">
                  Email
                </label>
                <div className="flex items-center">
                  <FaEnvelope className="absolute ml-3 text-gray-400" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="phoneNumber">
                  Phone
                </label>
                <div className="flex items-center">
                  <FaPhone className="absolute ml-3 text-gray-400" />
                  <input
                    type="text"
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="country">
                  Country
                </label>
                <div className="flex items-center">
                  <FaGlobe className="absolute ml-3 text-gray-400" />
                  <input
                    type="text"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="address">
                  Address
                </label>
                <div className="flex items-center">
                  <FaMapMarkerAlt className="absolute ml-3 text-gray-400 mt-2" />
                  <textarea
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 min-h-[60px]"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md mt-2"
              >
                Save Changes
              </button>
            </form>
            <div className="my-10 border-t border-blue-100"></div>
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Bank Details</h2>
            {bankSuccess && <p className="text-green-600 mb-2 text-center">{bankSuccess}</p>}
            {bankError && <p className="text-red-500 mb-2 text-center">{bankError}</p>}
            <form onSubmit={handleBankSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="accountHolderName">Account Holder Name</label>
                <div className="flex items-center">
                  <FaIdCard className="absolute ml-3 text-gray-400" />
                  <input
                    type="text"
                    id="accountHolderName"
                    name="accountHolderName"
                    value={bankDetails.accountHolderName}
                    onChange={handleBankChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="bankName">Bank Name</label>
                <div className="flex items-center">
                  <FaUniversity className="absolute ml-3 text-gray-400" />
                  <input
                    type="text"
                    id="bankName"
                    name="bankName"
                    value={bankDetails.bankName}
                    onChange={handleBankChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="accountNumber">Account Number</label>
                <div className="flex items-center">
                  <FaKey className="absolute ml-3 text-gray-400" />
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={bankDetails.accountNumber}
                    onChange={handleBankChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
              </div>
              <div className="relative">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="branch">Branch</label>
                <div className="flex items-center">
                  <FaCodeBranch className="absolute ml-3 text-gray-400" />
                  <input
                    type="text"
                    id="branch"
                    name="branch"
                    value={bankDetails.branch}
                    onChange={handleBankChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="relative md:col-span-2">
                <label className="block text-gray-700 font-semibold mb-2" htmlFor="swiftCode">SWIFT Code</label>
                <div className="flex items-center">
                  <FaKey className="absolute ml-3 text-gray-400" />
                  <input
                    type="text"
                    id="swiftCode"
                    name="swiftCode"
                    value={bankDetails.swiftCode}
                    onChange={handleBankChange}
                    className="w-full pl-10 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg font-bold text-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md mt-2"
                >
                  {bankDetails.accountHolderName ? 'Update Bank Details' : 'Add Bank Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;