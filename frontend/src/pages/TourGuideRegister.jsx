import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';

const TourGuideRegister = () => {
  const [formData, setFormData] = useState({
    yearsOfExperience: '',
    languages: '',
    certification: '',
    bio: '',
    location: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const providerId = localStorage.getItem('providerId');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!providerId) {
      setError('No provider ID found. Please complete basic registration first.');
      return;
    }

    const advancedDetails = {
      ...formData,
      languages: formData.languages.split(',').map(lang => lang.trim()), // Convert comma-separated string to array
    };

    try {
      const response = await fetch('/api/service-provider/register-advanced', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          providerId,
          providerType: 'TourGuide',
          advancedDetails,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess('Advanced registration completed successfully! Redirecting to login...');
        // Clear localStorage to avoid stale data
        localStorage.removeItem('provider');
        localStorage.removeItem('providerId');
        localStorage.removeItem('providerType');
        // Redirect to login page
        setTimeout(() => navigate('/service-provider/login'), 2000);
      } else {
        setError(data.message || 'Failed to register advanced details');
      }
    } catch {
      setError('Failed to connect to the server');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <main className="flex-grow flex mt-20 lg:mt-24 mb-12 lg:mb-16">
        <div className="w-full flex justify-center items-center p-6">
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md mt-6 lg:mt-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Tour Guide Advanced Registration</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleChange}
                  placeholder="Years of Experience"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="Languages (e.g., English, Spanish)"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  placeholder="Certification"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Bio"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Location"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
              >
                Complete Registration
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TourGuideRegister;