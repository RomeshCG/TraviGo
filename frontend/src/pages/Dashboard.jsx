import { useEffect, useState } from 'react';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setError('No user data found. Please log in again.');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">User Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {user ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {user.username}!</h2>
          <p className="mb-2"><strong>Email:</strong> {user.email}</p>
          <p className="mb-2"><strong>Phone Number:</strong> {user.phoneNumber}</p>
          <p className="mb-2"><strong>Country:</strong> {user.country}</p>
          <p className="text-gray-500 text-sm mt-4">
            This is a dummy dashboard. The actual dashboard is under development.
          </p>
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
  );
};

export default Dashboard;