import React from 'react';

const AccountSettings = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
      <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Change Password */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Change Password</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="current-password">
                Current Password
              </label>
              <input
                type="password"
                id="current-password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2" htmlFor="new-password">
                New Password
              </label>
              <input
                type="password"
                id="new-password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-lg hover:from-blue-700 hover:to-blue-900 transition-all"
            >
              Update Password
            </button>
          </form>
        </div>

        {/* Notification Settings */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notification Settings</h2>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-gray-700">Email Notifications</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span className="text-gray-700">SMS Notifications</span>
            </label>
          </div>
        </div>

        {/* Delete Account */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Delete Account</h2>
          <p className="text-gray-600 mb-4">Permanently delete your account and all associated data.</p>
          <button className="w-full bg-gradient-to-r from-red-600 to-red-800 text-white py-3 rounded-lg hover:from-red-700 hover:to-red-900 transition-all">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;