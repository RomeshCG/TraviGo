import { useNavigate } from 'react-router-dom';

function AdminHeader() {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin')) || {};
  const username = admin.username || 'Admin';

  const handleSignOut = () => {
    localStorage.removeItem('admin');
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const handleBackToHome = () => {
    navigate('/'); // Navigate to home page without logging out
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">TraviGo</h1>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleBackToHome}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all"
        >
          Back to Home
        </button>
        <span className="text-white font-medium">Welcome, {username}</span>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default AdminHeader;