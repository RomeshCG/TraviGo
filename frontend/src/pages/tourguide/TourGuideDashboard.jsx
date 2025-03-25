import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SimpleHeader from '../../components/SimpleHeader';
import Footer from '../../components/Footer';

const TourGuideDashboard = () => {
  const [tourGuide, setTourGuide] = useState(null);
  const [tourPackages, setTourPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTourGuideData = async () => {
      setIsLoading(true);
      setError('');
      setSuccess('');

      try {
        const provider = JSON.parse(localStorage.getItem('provider'));
        if (!provider || !provider._id) {
          setError('You need to log in to access the dashboard.');
          setTimeout(() => navigate('/service-provider/login'), 2000);
          return;
        }

        let response = await fetch(`/api/tour-guide/provider/${provider._id}`);
        if (response.status === 404) {
          const createResponse = await fetch('/api/tour-guide/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              providerId: provider._id,
              name: provider.email.split('@')[0],
              bio: '',
              location: '',
              languages: [],
              yearsOfExperience: 0,
              certification: '',
            }),
          });

          if (!createResponse.ok) {
            const errorData = await createResponse.json();
            throw new Error(errorData.message || 'Failed to create tour guide');
          }

          response = await fetch(`/api/tour-guide/provider/${provider._id}`);
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch tour guide data');
        }

        const data = await response.json();
        setTourGuide(data);

        // Fetch tour packages
        if (data._id) {
          const packagesResponse = await fetch(`/api/tour-guide/${data._id}/tour-packages`);
          if (packagesResponse.ok) {
            const packagesData = await packagesResponse.json();
            setTourPackages(packagesData);
          } else {
            console.error('Failed to fetch tour packages:', await packagesResponse.json());
            setTourPackages([]); // Fallback to empty array
          }

          // Fetch reviews
          const reviewsResponse = await fetch(`/api/tour-guide/${data._id}/reviews`);
          if (reviewsResponse.ok) {
            const reviewsData = await reviewsResponse.json();
            setReviews(reviewsData.reviews || []);
            setAverageRating(reviewsData.averageRating || 0);
          } else {
            console.error('Failed to fetch reviews:', await reviewsResponse.json());
            setReviews([]); // Fallback to empty array
            setAverageRating(0);
          }
        } else {
          throw new Error('Invalid tour guide ID');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTourGuideData();
  }, [navigate]);

  const handlePublish = async (packageId) => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/tour-guide/tour-package/${packageId}/publish`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        setTourPackages(tourPackages.map(pkg =>
          pkg._id === packageId ? { ...pkg, status: 'published' } : pkg
        ));
        setSuccess('Tour package published successfully!');
        setTimeout(() => navigate('/tour-guide/dashboard'), 2000);
      } else {
        setError(data.message || 'Failed to publish tour package');
      }
    } catch (err) {
      setError(`Failed to publish tour package: ${err.message}`);
    }
  };

  const handleDelete = async (packageId) => {
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`/api/tour-guide/tour-package/${packageId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (response.ok) {
        setTourPackages(tourPackages.filter(pkg => pkg._id !== packageId));
        setSuccess('Tour package deleted successfully!');
        setTimeout(() => navigate('/tour-guide/dashboard'), 2000);
      } else {
        setError(data.message || 'Failed to delete tour package');
      }
    } catch (err) {
      setError(`Failed to delete tour package: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <SimpleHeader />
      <div className="flex-grow container mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Tour Guide Dashboard</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {success && <p className="text-green-500 text-center mb-4">{success}</p>}
        {isLoading ? (
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-gray-200 h-12 w-12 mx-auto mt-4 animate-spin"></div>
          </div>
        ) : tourGuide ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <img
                  src={tourGuide.profilePicture || 'https://via.placeholder.com/100'}
                  alt="Profile"
                  className="w-24 h-24 rounded-full mr-4"
                />
                <div>
                  <h2 className="text-2xl font-semibold">{tourGuide.name}</h2>
                  {tourGuide.verifiedBadge && (
                    <span className="inline-flex items-center bg-green-500 text-white text-sm px-2 py-1 rounded-full mt-2">
                      Verified <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </span>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-2"><strong>Bio:</strong> {tourGuide.bio || 'Not provided'}</p>
              <p className="text-gray-600 mb-2"><strong>Location:</strong> {tourGuide.location || 'Not specified'}</p>
              <p className="text-gray-600 mb-2"><strong>Languages:</strong> {tourGuide.languages?.join(', ') || 'Not specified'}</p>
              <p className="text-gray-600 mb-2"><strong>Years of Experience:</strong> {tourGuide.yearsOfExperience || '0'}</p>
              <p className="text-gray-600 mb-2"><strong>Certification:</strong> {tourGuide.certification || 'Not provided'}</p>
              <p className="text-gray-600 mb-2"><strong>Verification Status:</strong> {tourGuide.verificationStatus || 'Pending'}</p>
              <p className="text-gray-600 mb-2"><strong>Average Rating:</strong> {averageRating ? averageRating.toFixed(1) : '0'} / 5</p>
              <Link to="/tour-guide/chat" className="mt-4 inline-block bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition">
                Chat with Tourists
              </Link>
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-semibold">Your Tour Packages</h2>
                  {tourGuide.verificationStatus === 'verified' ? (
                    <Link to="/tour-guide/create-package" className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">
                      Create New Package
                    </Link>
                  ) : (
                    <p className="text-red-500 text-sm">You must be verified to create tour packages.</p>
                  )}
                </div>
                {tourPackages.length === 0 ? (
                  <p className="text-gray-600">No tour packages created yet.</p>
                ) : (
                  <div className="space-y-4">
                    {tourPackages.map((pkg) => (
                      <div key={pkg._id} className="border p-4 rounded-lg flex justify-between items-center">
                        <div>
                          <h3 className="text-xl font-semibold">{pkg.title}</h3>
                          <p className="text-gray-600">{pkg.description}</p>
                          <p className="text-gray-600">Status: {pkg.status}</p>
                          <p className="text-gray-600">Price: ${pkg.price}</p>
                          <p className="text-gray-600">Duration: {pkg.duration}</p>
                          <p className="text-gray-600">Location: {pkg.location}</p>
                        </div>
                        <div className="space-x-2">
                          {pkg.status === 'draft' && (
                            <button
                              onClick={() => handlePublish(pkg._id)}
                              className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
                            >
                              Publish
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(pkg._id)}
                            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-semibold mb-4">Your Reviews</h2>
                {reviews.length === 0 ? (
                  <p className="text-gray-600">No reviews yet.</p>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review._id} className="border p-4 rounded-lg">
                        <p className="text-gray-600">
                          <strong>{review.touristId?.username || 'Anonymous'}</strong> rated {review.rating}/5
                        </p>
                        <p className="text-gray-600">{review.comment}</p>
                        <p className="text-gray-500 text-sm">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600">No tour guide data available.</p>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default TourGuideDashboard;