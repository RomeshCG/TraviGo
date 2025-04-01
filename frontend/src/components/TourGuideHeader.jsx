import { useNavigate } from 'react-router-dom';

function TourGuideHeader() {
  const navigate = useNavigate();
  const provider = JSON.parse(localStorage.getItem('provider')) || {};
  const providerName = provider.email?.split('@')[0] || 'Tour Guide'; // Use email prefix as a fallback name

  const handleLogout = () => {
    localStorage.removeItem('providerToken');
    localStorage.removeItem('provider');
    navigate('/service-provider/login', { replace: true });
  };

  const handleBackToDashboard = () => {
    navigate('/tour-guide/dashboard'); // Navigate back to the dashboard
  };

  return (
    <header className="bg-gradient-to-r from-teal-600 to-green-800 shadow-lg p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">TraviGo Tour Guide</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBackToDashboard}
          className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-all"
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

export default TourGuideHeader;