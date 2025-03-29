import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HotelProviderDashboard = () => {
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedProvider = localStorage.getItem('provider');
    if (storedProvider) {
      const providerData = JSON.parse(storedProvider);
      if (providerData.providerType === 'HotelProvider') {
        setProvider(providerData);
      } else {
        setError('Unauthorized access. Please log in as a Hotel Provider.');
      }
    } else {
      setError('No provider data found. Please log in again.');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('provider');
    navigate('/service-provider/login');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Hotel Provider Dashboard</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      {provider ? (
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4">Welcome, {provider.name}!</h2>
          <p className="mb-2"><strong>Email:</strong> {provider.email}</p>
          <p className="mb-2"><strong>Provider Type:</strong> {provider.providerType}</p>
          <p className="text-gray-500 text-sm mt-4">
            This is a dummy dashboard for Hotel Providers. The actual dashboard is under development.
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition"
          >
            Log Out
          </button>
        </div>
      ) : (
        <p>Loading provider data...</p>
      )}
    </div>
  );
};

export default HotelProviderDashboard;