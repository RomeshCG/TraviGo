import React from 'react';

const UserTopBar = ({ username, onLogout }) => {
  return (
    <div className="w-full bg-gray-100 text-gray-800 flex justify-between items-center px-6 py-2 text-sm border-b border-gray-200 z-50">
      <div className="font-medium">Welcome, {username}</div>
      <div className="flex items-center gap-3">
        <a
          href="/user/dashboard"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded transition-colors duration-200"
        >
          Dashboard
        </a>
        <button
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded transition-colors duration-200"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default UserTopBar;
