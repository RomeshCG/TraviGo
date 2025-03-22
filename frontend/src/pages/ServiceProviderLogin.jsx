import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';
import backgroundImage from '../assets/login_page_img.jpg'; // Adjust the path as needed

const ServiceProviderLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/service-provider/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setError('');
        // Store provider data in localStorage for the dashboard
        localStorage.setItem('provider', JSON.stringify(data.provider));
        // Redirect to the appropriate dashboard based on providerType
        const providerType = data.provider.providerType;
        if (providerType === 'HotelProvider') {
          navigate('/pages/hotel/dashboard');
        } else if (providerType === 'TourGuide') {
          navigate('/pages/tourguide/dashboard');
        } else if (providerType === 'VehicleProvider') {
          navigate('/pages/vehicle/dashboard');
        } else {
          setError('Invalid provider type');
          setIsLoading(false);
          return;
        }
      } else {
        setError(data.message);
        setSuccess('');
        setFormData({
          email: '',
          password: '',
        });
      }
    } catch {
      setError('Failed to connect to the server');
      setSuccess('');
      setFormData({
        email: '',
        password: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <div
        className="flex-grow flex items-center justify-center bg-cover bg-center mt-20 lg:mt-24" // Added margin-top
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-5xl p-6">
          {/* Left Section: Text */}
          <div className="text-white mb-8 lg:mb-0 lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">PARTNER WITH TRAVIGO</h1>
            <p className="text-lg">
              Join our network of service providers and reach travelers worldwide. Offer your hotels, tours, or vehicles with ease!
            </p>
          </div>

          {/* Right Section: Form */}
          <div className="bg-white bg-opacity-90 rounded-lg p-8 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Service Provider Login</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
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
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Logging In...' : 'Log In'}
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
              <Link to="/service-provider/register" className="text-blue-600 hover:underline">
                Register Here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ServiceProviderLogin;