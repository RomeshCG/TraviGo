import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';
import backgroundImage from '../assets/login_page_img.jpg';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setError('');
        // Store user data in localStorage (or a state management solution) for the dashboard
        localStorage.setItem('user', JSON.stringify(data.user));
        // Redirect to the dashboard
        navigate('/dashboard');
      } else {
        setError(data.message);
        setSuccess('');
      }
    } catch {
      setError('Failed to connect to the server');
      setSuccess('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
        <SimpleHeader />
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
      }}
    >
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-5xl p-6">
        {/* Left Section: Text */}
        <div className="text-white mb-8 lg:mb-0 lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">WHERE COMFORT MEETS CONVENIENCE</h1>
          <p className="text-lg">
            From luxury hotels to cozy home stays, find accommodations tailored to your needs.
          </p>
        </div>

        {/* Right Section: Form */}
        <div className="bg-white bg-opacity-90 rounded-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-semibold text-center mb-6">Log In</h2>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {success && <p className="text-green-500 text-center mb-4">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Username"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
            >
              Log In
            </button>
          </form>
          <div className="flex justify-center space-x-4 mt-4">
            <button className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition">
              G
            </button>
            <button className="bg-blue-700 text-white p-2 rounded-full hover:bg-blue-800 transition">
              F
            </button>
            <button className="bg-black text-white p-2 rounded-full hover:bg-gray-800 transition">
              X
            </button>
          </div>
          <p className="text-center mt-4 text-sm">
            Don’t have an account?{' '}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign Up Here
            </Link>
          </p>
        </div>
      </div>
    </div>
    <Footer />
    </div>
  );
};

export default Login;