import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SimpleHeader from '../components/SimpleHeader';
import Footer from '../components/Footer';
import backgroundImage from '../assets/login_page_img.jpg';

const TourGuideCreatePackage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: '',
    price: '',
    location: '',
    images: [],
    itinerary: [{ day: 1, activities: '' }],
    maxParticipants: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setFormData({ ...formData, images: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleItineraryChange = (index, field, value) => {
    const newItinerary = [...formData.itinerary];
    newItinerary[index][field] = value;
    setFormData({ ...formData, itinerary: newItinerary });
  };

  const addItineraryDay = () => {
    setFormData({
      ...formData,
      itinerary: [...formData.itinerary, { day: formData.itinerary.length + 1, activities: '' }],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const provider = JSON.parse(localStorage.getItem('provider'));
      if (!provider || !provider._id) {
        throw new Error('Provider not found in local storage');
      }

      const tourGuide = await fetch(`/api/tour-guide/provider/${provider._id}`).then(res => res.json());
      if (!tourGuide) {
        throw new Error('Tour guide not found');
      }

      // Upload images
      const formDataToSend = new FormData();
      formData.images.forEach((file) => {
        formDataToSend.append('images', file);
      });

      const uploadResponse = await fetch('/api/upload-tour-package-images', {
        method: 'POST',
        body: formDataToSend,
      });

      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok) {
        throw new Error(uploadData.message || 'Image upload failed');
      }

      const tourPackageData = {
        tourGuideId: tourGuide._id,
        title: formData.title,
        description: formData.description,
        duration: formData.duration,
        price: formData.price,
        location: formData.location,
        images: uploadData.images || [],
        itinerary: formData.itinerary,
        maxParticipants: formData.maxParticipants,
      };

      const response = await fetch('/api/tour-guide/tour-package', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourPackageData),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setError('');
        navigate('/pages/tourguide/dashboard');
      } else {
        setError(data.message);
        setSuccess('');
      }
    } catch (err) {
      console.error('Tour package creation error:', err);
      setError('Failed to create tour package');
      setSuccess('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <div
        className="flex-grow flex items-center justify-center bg-cover bg-center mt-20 lg:mt-24"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
        }}
      >
        <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-5xl p-6">
          <div className="text-white mb-8 lg:mb-0 lg:w-1/2">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">CREATE TOUR PACKAGE</h1>
            <p className="text-lg">
              Design an amazing tour package for travelers to explore with you!
            </p>
          </div>
          <div className="bg-white bg-opacity-90 rounded-lg p-8 w-full max-w-md shadow-lg">
            <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">Tour Package Details</h2>
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {success && <p className="text-green-500 text-center mb-4">{success}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Tour Title"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Description"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="Duration (e.g., 3 hours, 1 day)"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Price (in USD)"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-4">
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
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Tour Images</label>
                <input
                  type="file"
                  name="images"
                  onChange={handleChange}
                  multiple
                  className="w-full p-3 border rounded-lg"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Itinerary</label>
                {formData.itinerary.map((day, index) => (
                  <div key={index} className="mb-2">
                    <input
                      type="number"
                      value={day.day}
                      onChange={(e) => handleItineraryChange(index, 'day', e.target.value)}
                      placeholder="Day"
                      className="w-1/4 p-2 border rounded-lg mr-2"
                      disabled
                    />
                    <input
                      type="text"
                      value={day.activities}
                      onChange={(e) => handleItineraryChange(index, 'activities', e.target.value)}
                      placeholder="Activities"
                      className="w-3/4 p-2 border rounded-lg"
                      required
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItineraryDay}
                  className="text-blue-600 hover:underline"
                >
                  Add Day
                </button>
              </div>
              <div className="mb-6">
                <input
                  type="number"
                  name="maxParticipants"
                  value={formData.maxParticipants}
                  onChange={handleChange}
                  placeholder="Max Participants"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Creating...' : 'Create Tour Package'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TourGuideCreatePackage;