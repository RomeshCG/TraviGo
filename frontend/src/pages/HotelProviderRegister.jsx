import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';

const TERMS = `
You must be the legal owner or authorized manager of the hotel property.

You must provide accurate and verifiable business information, including licenses and identification documents upon request.

Hotel Owners must create an account with valid contact information.

You agree to provide true, current, and complete information about your hotel, including:
- Hotel name, location, and contact details
- Description, amenities, photos, and pricing
- Bank/payment details for payout processing

You agree to provide a safe, clean, and legally compliant accommodation.

Repeated negative reviews or complaints may lead to deactivation of your listing.

You may deactivate your listing at any time.

The Platform reserves the right to terminate your account for violations of these terms or legal regulations.

These Terms shall be governed and interpreted in accordance with the laws of Sri Lanka.

By registering your hotel, you confirm that you have read, understood, and agree to these Terms and Conditions.
`;

const HotelProviderRegister = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [providerId, setProviderId] = useState('');
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('providerId');
    const providerType = localStorage.getItem('providerType');
    if (!id || providerType !== 'HotelProvider') {
      navigate('/service-provider/register');
    } else {
      setProviderId(id);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!accepted) {
      setError('You must accept the Terms and Conditions to register.');
      return;
    }

    try {
      const response = await fetch('/api/service-provider/register-advanced', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          providerId,
          providerType: 'HotelProvider',
          acceptedTerms: true,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        localStorage.removeItem('providerId');
        localStorage.removeItem('providerType');
        setTimeout(() => navigate('/service-provider/login'), 2000);
      } else {
        setError(data.message);
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
          <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-xl mt-6 lg:mt-8">
            <h2 className="text-2xl font-semibold text-center mb-6">Hotel Provider Registration</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-6 max-h-96 overflow-y-auto border rounded p-4 bg-gray-50 text-gray-700 text-sm whitespace-pre-line">
                {TERMS}
              </div>
              <div className="mb-6 flex items-center">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={accepted}
                  onChange={e => setAccepted(e.target.checked)}
                  className="mr-2"
                  required
                />
                <label htmlFor="acceptTerms" className="text-gray-700">
                  I have read and accept the Terms and Conditions
                </label>
              </div>
              <button
                type="submit"
                className={`w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition ${!accepted ? 'opacity-60 cursor-not-allowed' : ''}`}
                disabled={!accepted}
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

export default HotelProviderRegister;