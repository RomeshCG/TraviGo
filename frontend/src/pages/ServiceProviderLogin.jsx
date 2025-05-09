import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';
import backgroundImage from '../assets/login_page_img.jpg';

const ServiceProviderLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("providerToken");
    if (token) {
      const verifyToken = async () => {
        try {
          const response = await fetch('/api/verify-provider-token', {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();
          if (response.ok && data.message === "Token is valid") {
            const { providerType } = data.provider;
            let redirectPath = '';
            if (providerType === 'HotelProvider') {
              redirectPath = '/dashboard';
            } else if (providerType === 'TourGuide') {
              redirectPath = '/tour-guide/dashboard';
            } else if (providerType === 'VehicleProvider') {
              redirectPath = '/pages/vehicle/dashboard';
            }
            if (redirectPath) {
              navigate(redirectPath, { replace: true });
            }
          }
        } catch (error) {
          console.error("Token verification error on mount:", error);
        }
      };
      verifyToken();
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/service-provider/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('Login response:', data);
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('providerToken', data.token);
        localStorage.setItem('provider', JSON.stringify(data.provider));

        const { providerType } = data.provider;
        let redirectPath = '';
        if (providerType === 'HotelProvider') {
          redirectPath = '/dashboard';
        } else if (providerType === 'TourGuide') {
          redirectPath = '/tour-guide/dashboard';
        } else if (providerType === 'VehicleProvider') {
          redirectPath = '/pages/vehicle/dashboard';
        } else {
          setError('Unknown provider type');
          return;
        }

        console.log('Navigating to:', redirectPath);
        setTimeout(() => {
          navigate(redirectPath, { replace: true });
        }, 2000);
      } else {
        setError(data.message || 'Failed to log in');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to connect to the server');
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
          <div className="text-white mb-8 lg:mb-0 lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">PARTNER WITH TRAVIGO</h1>
            <p className="text-lg">
              Earn more with TraviGo Partner Programme.
            </p>
          </div>
          <div className="bg-white bg-opacity-90 rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Service Provider Login</h2>
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
              Don't have an account?{' '}
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