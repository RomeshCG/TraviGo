import { useNavigate } from 'react-router-dom';

function VehicleProviderHeader() {
  const navigate = useNavigate();
  const provider = JSON.parse(localStorage.getItem('provider')) || {};
  const providerName = provider.email?.split('@')[0] || 'Vehicle Provider';

  const handleLogout = () => {
    localStorage.removeItem('providerToken');
    localStorage.removeItem('provider');
    navigate('/service-provider/login', { replace: true });
  };

  const handleBackToDashboard = () => {
    navigate('/vehicle/dashboard');
  };

  return (
    <header className="bg-gradient-to-r from-blue-700 to-blue-900 shadow-lg p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">TraviGo Vehicle Provider</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBackToDashboard}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Back to Dashboard
        </button>
        <span className="text-white font-medium">Welcome, {providerName}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default VehicleProviderHeader;
