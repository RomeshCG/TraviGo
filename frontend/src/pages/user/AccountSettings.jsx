import React, { useState } from 'react';
import SidebarUser from '../../components/SidebarUser';
import HeaderUser from '../../components/HeaderUser';

const AccountSettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Toast helper (uses alert if no toast library)
  const showToast = (msg, type = 'info') => {
    if (window.toast) {
      window.toast(msg, { type });
    } else {
      alert(msg);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (!storedUser || !storedUser._id) {
        showToast('User not found. Please log in again.', 'error');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/user/change-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: storedUser._id,
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Password changed successfully!', 'success');
        setCurrentPassword('');
        setNewPassword('');
      } else {
        showToast(data.message || 'Failed to change password', 'error');
      }
    } catch {
      showToast('An error occurred. Please try again.', 'error');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex">
      <SidebarUser />
      <div style={{ marginLeft: 'var(--sidebar-width, 16rem)' }} className="flex-1">
        <HeaderUser />
        <div className="p-6 md:p-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-10">Account Settings</h1>
          <div className="max-w-lg mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
            {/* Change Password */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Change Password</h2>
              <form onSubmit={handlePasswordChange}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="current-password">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="current-password"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2" htmlFor="new-password">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="new-password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all shadow-md"
                  disabled={loading}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
            {/* Delete Account */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Delete Account</h2>
              <p className="text-gray-600 mb-4">Permanently delete your account and all associated data.</p>
              <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all shadow-md">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;