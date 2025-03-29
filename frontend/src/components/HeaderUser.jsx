import { useNavigate } from 'react-router-dom';

function HeaderUser() {
  const navigate = useNavigate();

  // Get the user data from localStorage
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const username = user.username || 'Guest'; // Fallback to 'Guest' if no username is found

  const handleSignOut = () => {
    // Clear localStorage
    localStorage.removeItem('user');
    // Redirect to login page
    navigate('/login');
  };

  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">TraviGo</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Welcome, {username}</span>
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default HeaderUser;