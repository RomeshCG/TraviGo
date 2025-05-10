import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Home from './Home';
import IncomingBookings from './IncomingBookings';
import PreviousBookings from './PreviousBookings';
import Reports from './Reports';
import AddVehicle from './AddVehicle';

const VehicleProviderDashboard = () => {
  const [provider, setProvider] = useState(null);
  const [error, setError] = useState('');
  const [activeSection, setActiveSection] = useState('home');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedProvider = localStorage.getItem('provider');
    console.log('Stored provider:', storedProvider);
    if (storedProvider) {
      try {
        const providerData = JSON.parse(storedProvider);
        console.log('Parsed provider data:', providerData);
        if (providerData.providerType === 'VehicleProvider') {
          setProvider(providerData);
        } else {
          setError('Unauthorized access. Please log in as a Vehicle Provider.');
          setTimeout(() => {
            localStorage.removeItem('provider');
            localStorage.removeItem('providerToken');
            navigate('/service-provider/login');
          }, 2000);
        }
      } catch (err) {
        console.error('Error parsing provider data:', err);
        setError('Invalid provider data. Please log in again.');
        setTimeout(() => {
          localStorage.removeItem('provider');
          localStorage.removeItem('providerToken');
          navigate('/service-provider/login');
        }, 2000);
      }
    } else {
      setError('No provider data found. Please log in again.');
      setTimeout(() => {
        localStorage.removeItem('provider');
        localStorage.removeItem('providerToken');
        navigate('/service-provider/login');
      }, 2000);
    }
    setLoading(false);
  }, [navigate]);

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <Home provider={provider} />;
      case 'incomingBookings':
        return <IncomingBookings providerId={provider._id} setError={setError} />;
      case 'previousBookings':
        return <PreviousBookings providerId={provider._id} setError={setError} />;
      case 'reports':
        return <Reports />;
      case 'addVehicle':
        return <AddVehicle providerId={provider._id} setError={setError} />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading provider data...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      {provider && (
        <div className="w-64 bg-gray-800 text-white fixed h-full">
          <Sidebar setActiveSection={setActiveSection} navigate={navigate} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-md p-4 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Vehicle Provider Dashboard</h1>
          {provider && (
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {provider.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('provider');
                  localStorage.removeItem('providerToken');
                  navigate('/service-provider/login');
                }}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        {/* Content */}
        <main className="p-6 bg-gray-100 min-h-[calc(100vh-64px)]">
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {provider ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              {renderSection()}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
};

export default VehicleProviderDashboard;