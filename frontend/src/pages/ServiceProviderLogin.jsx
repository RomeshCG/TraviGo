import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';
import BackgroundImage from '../assets/login_page_img.jpg';

const ServiceProviderLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
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
        setSuccess('Login successful! Redirecting...');
        localStorage.setItem('provider', JSON.stringify(data.provider));
        if (data.provider.providerType === 'HotelProvider') {
          setTimeout(() => navigate('/pages/hotel/dashboard'), 2000);
        } else if (data.provider.providerType === 'TourGuide') {
          setTimeout(() => navigate('/tour-guide/dashboard'), 2000);
        } else if (data.provider.providerType === 'VehicleProvider') {
          setTimeout(() => navigate('/pages/vehicle/dashboard'), 2000);
        }
      } else {
        setError(data.message || 'Failed to log in');
      }
    } catch {
      setError('Failed to connect to the server');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col bg-cover bg-center"
      style={{
        backgroundImage: `url('linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${BackgroundImage})')`, // Replace with your image URL
      }}
    >
      <SimpleHeader />
      <main className="flex-grow flex mt-20 lg:mt-24 mb-12 lg:mb-16">
        <div className="w-full flex justify-center items-center p-6">
          <div className="bg-white bg-opacity-90 shadow-lg rounded-lg p-8 w-full max-w-md mt-6 lg:mt-8">
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
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ServiceProviderLogin;