import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';
import backgroundImage from '../assets/login_page_img.jpg';

const SignIn = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rePassword: '',
    email: '',
    phoneNumber: '',
    country: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (formData.password !== formData.rePassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          phoneNumber: formData.phoneNumber,
          country: formData.country,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message || 'Registration successful! Redirecting to login...');
        setError('');
        // Clear the form
        setFormData({
          username: '',
          password: '',
          rePassword: '',
          email: '',
          phoneNumber: '',
          country: '',
        });
        // Redirect to login page after a short delay
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(data.message || 'Failed to register');
        setSuccess('');
      }
    } catch (err) {
      console.error('Registration error:', err);
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
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">Your Journey Starts Here</h1>
            <p className="text-lg">
              Book hotels, rent vehicles, and hire tour guides all in one place. Easy, fast, and secure!
            </p>
          </div>

          {/* Right Section: Form */}
          <div className="bg-white bg-opacity-90 rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold text-center mb-6">Sign Up</h2>
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
              <div className="mb-4">
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
              <div className="mb-4">
                <input
                  type="password"
                  name="rePassword"
                  value={formData.rePassword}
                  onChange={handleChange}
                  placeholder="Re-enter Password"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
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
              <div className="mb-4">
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone number"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Country"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
              >
                Sign Up
              </button>
            </form>
            <p className="text-center mt-4 text-sm">
              If you already have an account{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Log In Here
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SignIn;