import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import TourGuideHeader from '../../components/TourGuideHeader';
import Footer from '../../components/Footer';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Modal from 'react-modal';

function TourGuideEarnings({ tourGuide }) {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [cashoutLoading, setCashoutLoading] = useState(false);
  const [cashoutRequested, setCashoutRequested] = useState(false);
  const [eligibleBookings, setEligibleBookings] = useState([]);
  const [selectedBookings, setSelectedBookings] = useState([]);
  const BASE_URL = 'http://localhost:5000';

  useEffect(() => {
    if (!tourGuide?._id) return;
    setLoading(true);
    fetch(`${BASE_URL}/api/tour-guide/${tourGuide._id}/earnings-summary`)
      .then(res => res.json())
      .then(data => {
        setSummary(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load earnings summary');
        setLoading(false);
      });
  }, [tourGuide]);

  const fetchEligibleBookings = async () => {
    setCashoutLoading(true);
    try {
      const token = localStorage.getItem('providerToken');
      const res = await fetch(`${BASE_URL}/api/tour-guide/${tourGuide._id}/tour-guide-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch bookings');
      const allBookings = await res.json();
      const eligible = allBookings.filter(b =>
        b.paymentStatus === 'released' &&
        !b.refundRequested &&
        ['approved', 'completed'].includes(b.bookingStatus)
      );
      setEligibleBookings(eligible);
    } catch {
      setEligibleBookings([]);
    }
    setCashoutLoading(false);
  };

  const handleOpenCashoutModal = () => {
    setShowModal(true);
    setSelectedBookings([]);
    fetchEligibleBookings();
  };

  const handleBookingCheckbox = (bookingId) => {
    setSelectedBookings(prev =>
      prev.includes(bookingId)
        ? prev.filter(id => id !== bookingId)
        : [...prev, bookingId]
    );
  };

  const handleRequestCashout = async () => {
    if (!selectedBookings.length) {
      toast.error('Select at least one trip to cash out');
      return;
    }
    setCashoutLoading(true);
    setCashoutRequested(false);
    try {
      const token = localStorage.getItem('providerToken');
      const res = await fetch(`${BASE_URL}/api/tour-guide/${tourGuide._id}/request-cashout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ bookings: selectedBookings })
      });
      if (res.ok) {
        setCashoutRequested(true);
        toast.success('Cashout request sent to admin!');
        setShowModal(false);
        setSelectedBookings([]);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Failed to request cashout');
      }
    } catch {
      toast.error('Failed to request cashout');
    }
    setCashoutLoading(false);
  };

  if (loading) return <div className="text-center py-10">Loading earnings...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;
  if (!summary) return null;

  const recentSorted = summary?.recent ? [...summary.recent].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) : [];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6">Earnings Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg p-5 text-center">
          <div className="text-lg text-gray-600 mb-2">Total Earnings</div>
          <div className="text-3xl font-bold text-green-700">${summary.totalEarnings.toFixed(2)}</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-5 text-center">
          <div className="text-lg text-gray-600 mb-2">Pending Payout</div>
          <div className="text-3xl font-bold text-yellow-700">${summary.pendingEarnings.toFixed(2)}</div>
        </div>
        <div className="bg-blue-50 rounded-lg p-5 text-center">
          <div className="text-lg text-gray-600 mb-2">Total Cashouts</div>
          <div className="text-3xl font-bold text-blue-700">${summary.totalCashouts?.toFixed(2) ?? '0.00'}</div>
        </div>
        <div className="bg-red-50 rounded-lg p-5 text-center">
          <div className="text-lg text-gray-600 mb-2">Refunded/Cancelled</div>
          <div className="text-3xl font-bold text-red-700">${summary.refunded.toFixed(2)}</div>
        </div>
      </div>
      <button
        onClick={handleOpenCashoutModal}
        disabled={cashoutLoading || cashoutRequested}
        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-6 py-2 rounded-lg shadow-md hover:from-green-600 hover:to-teal-600 transition mb-6"
      >
        Request Cashout
      </button>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ background: "rgba(30, 41, 59, 0.15)", backdropFilter: "blur(2px)" }}>
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-xl font-bold mb-4">Request Cashout</h3>
            {cashoutLoading ? (
              <div>Loading eligible trips...</div>
            ) : eligibleBookings.length === 0 ? (
              <div className="text-gray-600">No eligible trips for cashout.</div>
            ) : (
              <>
                <label className="block mb-2 text-gray-700">Select trips to cash out:</label>
                <div className="max-h-48 overflow-y-auto border rounded mb-4">
                  {eligibleBookings.map(b => (
                    <div key={b._id} className="flex items-center px-2 py-1 border-b last:border-b-0">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(b._id)}
                        onChange={() => handleBookingCheckbox(b._id)}
                        className="mr-2"
                        id={`booking-${b._id}`}
                      />
                      <label htmlFor={`booking-${b._id}`} className="flex-1 cursor-pointer">
                        {b.packageId?.title || 'Trip'} | {new Date(b.travelDate).toLocaleDateString()} | ${b.totalPrice?.toFixed(2)}
                      </label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                    disabled={cashoutLoading}
                  >Cancel</button>
                  <button
                    onClick={handleRequestCashout}
                    className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600"
                    disabled={cashoutLoading}
                  >{cashoutLoading ? 'Requesting...' : 'Request'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
      <h3 className="text-xl font-semibold mb-4">Recent Transactions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Package</th>
              <th className="p-2 text-left">Amount</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-left">Payout</th>
              <th className="p-2 text-left">Refund</th>
            </tr>
          </thead>
          <tbody>
            {recentSorted.map(tx => (
              <tr key={tx._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{tx.createdAt ? new Date(tx.createdAt).toLocaleDateString() : '-'}</td>
                <td className="p-2">{tx.packageId?.title || String(tx.packageId)}</td>
                <td className="p-2">${tx.totalPrice?.toFixed(2) ?? '-'}</td>
                <td className="p-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    tx.bookingStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    tx.bookingStatus === 'confirmed' ? 'bg-green-100 text-green-800' :
                    tx.bookingStatus === 'completed' ? 'bg-blue-100 text-blue-800' :
                    tx.bookingStatus === 'cancelled' ? 'bg-gray-200 text-gray-600' :
                    tx.bookingStatus === 'approved' ? 'bg-blue-100 text-blue-800' :
                    tx.bookingStatus === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {tx.bookingStatus}
                  </span>
                </td>
                <td className="p-2">
                  {tx.paymentStatus === 'released' ? (
                    <span className="text-blue-700 font-bold">In TraviGo Balance</span>
                  ) : tx.paymentStatus === 'cashout_pending' ? (
                    <span className="text-yellow-700 font-bold">Pending Cashout</span>
                  ) : tx.paymentStatus === 'cashout_done' ? (
                    <span className="text-green-700 font-bold">Cashed Out</span>
                  ) : tx.paymentStatus === 'holding' ? (
                    <span className="text-gray-700 font-bold">Holding</span>
                  ) : tx.paymentStatus === 'refunded' ? (
                    <span className="text-red-700 font-bold">Refunded</span>
                  ) : (
                    '-'
                  )}
                </td>
                <td className="p-2">{tx.refundRequested || tx.bookingStatus === 'cancelled' ? <span className="text-red-600 font-bold">Refunded</span> : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const TourGuideDashboard = () => {
  const [tourGuide, setTourGuide] = useState(null);
  const [tourPackages, setTourPackages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [tourBookings, setTourBookings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    location: '',
    languages: [],
    yearsOfExperience: 0,
    certification: '',
  });
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');
  const [review, setReview] = useState({ rating: 5, comment: '' });
  const [reviewed, setReviewed] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [bankDetails, setBankDetails] = useState({
    accountHolderName: '',
    bankName: '',
    accountNumber: '',
    branch: '',
    swiftCode: '',
  });
  const [bankSuccess, setBankSuccess] = useState('');
  const [bankError, setBankError] = useState('');

  const navigate = useNavigate();
  const BASE_URL = 'http://localhost:5000';

  const fetchTourGuideData = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('You need to log in to access the dashboard.');
        setTimeout(() => navigate('/service-provider/login'), 2000);
        return;
      }

      const providerResponse = await fetch(`${BASE_URL}/api/verify-provider-token`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!providerResponse.ok) throw new Error('Failed to verify provider');
      
      const providerData = await providerResponse.json();
      const provider = providerData.provider;

      const response = await fetch(`${BASE_URL}/api/tour-guide/provider/${provider._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 404) {
        // Create new tour guide if not exists
        const createResponse = await fetch(`${BASE_URL}/api/tour-guide/create`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
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

        if (!createResponse.ok) throw new Error('Failed to create tour guide');
      }

      const guideData = await fetch(`${BASE_URL}/api/tour-guide/provider/${provider._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json());

      setTourGuide(guideData);

      // Fetch tour packages
      const packagesData = await fetch(`${BASE_URL}/api/tour-guide/${guideData._id}/tour-packages`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json());
      setTourPackages(packagesData);

      // Fetch reviews
      const reviewsData = await fetch(`${BASE_URL}/api/tour-guide/${guideData._id}/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      }).then(res => res.json());
      setReviews(reviewsData.reviews || []);
      setAverageRating(reviewsData.averageRating || 0);

      // Fetch bookings using correct backend route
      const bookingsResponse = await fetch(`${BASE_URL}/api/tour-guide/${guideData._id}/tour-guide-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      let bookingsData = [];
      if (bookingsResponse.ok) {
        bookingsData = await bookingsResponse.json();
        // Sort bookings by createdAt descending
        const sorted = bookingsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setTourBookings(sorted);
      } else {
        setTourBookings([]);
      }

      setFormData({
        name: guideData.name || '',
        bio: guideData.bio || '',
        location: guideData.location || '',
        languages: guideData.languages || [],
        yearsOfExperience: guideData.yearsOfExperience || 0,
        certification: guideData.certification || '',
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [BASE_URL, navigate]);

  useEffect(() => {
    fetchTourGuideData();
  }, [fetchTourGuideData]);

  useEffect(() => {
    if (tourGuide && tourGuide.bankDetails && tourGuide.bankDetails.accountHolderName) {
      setBankDetails({
        accountHolderName: tourGuide.bankDetails.accountHolderName || '',
        bankName: tourGuide.bankDetails.bankName || '',
        accountNumber: tourGuide.bankDetails.accountNumber || '',
        branch: tourGuide.bankDetails.branch || '',
        swiftCode: tourGuide.bankDetails.swiftCode || '',
      });
    } else {
      setBankDetails({
        accountHolderName: '',
        bankName: '',
        accountNumber: '',
        branch: '',
        swiftCode: '',
      });
    }
  }, [tourGuide]);

  const handleBookingStatusUpdate = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem('providerToken');
      const response = await fetch(`${BASE_URL}/api/tour-bookings/${bookingId}/booking-status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ bookingStatus: newStatus }),
      });
      if (response.ok) {
        setTourBookings(prevBookings =>
          prevBookings.map(booking =>
            booking._id === bookingId ? { ...booking, bookingStatus: newStatus } : booking
          )
        );
        toast.success(`Booking ${newStatus} successfully!`);
      } else {
        throw new Error('Failed to update booking status');
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePublish = async (packageId) => {
    setError('');
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('No token found. Please log in again.');
        setTimeout(() => navigate('/service-provider/login'), 2000);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/tour-guide/tour-package/${packageId}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTourPackages(tourPackages.map(pkg =>
          pkg._id === packageId ? { ...pkg, status: 'published' } : pkg
        ));
        toast.success('Tour package published successfully!');
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
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('No token found. Please log in again.');
        setTimeout(() => navigate('/service-provider/login'), 2000);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/tour-guide/tour-package/${packageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setTourPackages(tourPackages.filter(pkg => pkg._id !== packageId));
        toast.success('Tour package deleted successfully!');
        setTimeout(() => navigate('/tour-guide/dashboard'), 2000);
      } else {
        setError(data.message || 'Failed to delete tour package');
      }
    } catch (err) {
      setError(`Failed to delete tour package: ${err.message}`);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!profilePictureFile) {
      setError('Please select a profile picture file');
      return;
    }
    setError('');
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('No token found. Please log in again.');
        setTimeout(() => navigate('/service-provider/login'), 2000);
        return;
      }

      const formData = new FormData();
      formData.append('tourGuideId', tourGuide._id);
      formData.append('profilePicture', profilePictureFile);
      const response = await fetch(`${BASE_URL}/api/tour-guide/update-profile-picture`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setTourGuide({ ...tourGuide, profilePicture: data.tourGuide.profilePicture });
        toast.success('Profile picture updated successfully!');
        setProfilePictureFile(null);
      } else {
        setError(data.message || 'Failed to update profile picture');
      }
    } catch (err) {
      setError(`Failed to connect to the server: ${err.message}`);
    }
  };

  const handleUpdateBanner = async () => {
    if (!bannerFile) {
      setError('Please select a banner file');
      return;
    }
    setError('');
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('No token found. Please log in again.');
        setTimeout(() => navigate('/service-provider/login'), 2000);
        return;
      }

      const formData = new FormData();
      formData.append('tourGuideId', tourGuide._id);
      formData.append('banner', bannerFile);
      const response = await fetch(`${BASE_URL}/api/tour-guide/update-banner`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        setTourGuide({ ...tourGuide, banner: data.tourGuide.banner });
        toast.success('Banner updated successfully!');
        setBannerFile(null);
      } else {
        setError(data.message || 'Failed to update banner');
      }
    } catch (err) {
      setError(`Failed to connect to the server: ${err.message}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'languages') {
      setFormData({ ...formData, languages: value.split(',').map(lang => lang.trim()) });
    } else if (name === 'yearsOfExperience') {
      setFormData({ ...formData, yearsOfExperience: parseInt(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) {
        setError('No token found. Please log in again.');
        setTimeout(() => navigate('/service-provider/login'), 2000);
        return;
      }

      const response = await fetch(`${BASE_URL}/api/tour-guide/update-profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tourGuideId: tourGuide._id,
          ...formData,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setTourGuide({ ...tourGuide, ...formData });
                toast.success('Profile updated successfully!');
      } else {
        setError(data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(`Failed to update profile: ${err.message}`);
    }
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setBankError('');
    setBankSuccess('');
    try {
      const token = localStorage.getItem('providerToken');
      if (!token) throw new Error('No token found. Please log in again.');
      const response = await fetch(`${BASE_URL}/api/tour-guide/update-bank-details`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tourGuideId: tourGuide._id, bankDetails }),
      });
      const data = await response.json();
      if (response.ok) {
        setBankSuccess('Bank details updated successfully');
      } else {
        throw new Error(data.message || 'Failed to update bank details');
      }
    } catch (err) {
      setBankError(err.message || 'An error occurred while updating bank details');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('providerToken');
    localStorage.removeItem('provider');
    toast.success('Logged out successfully!');
    setTimeout(() => navigate('/service-provider/login', { replace: true }), 2000);
  };

  const handleViewBooking = async (bookingId) => {
    setModalLoading(true);
    setModalError('');
    try {
      const token = localStorage.getItem('providerToken');
      const res = await fetch(`${BASE_URL}/api/tour-bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch booking details');
      const data = await res.json();
      setSelectedBooking(data);
    } catch (err) {
      setModalError(err.message);
      setSelectedBooking(null);
    } finally {
      setModalLoading(false);
    }
  };

  const handleCompleteBooking = async () => {
    if (!selectedBooking) return;
    setCompleting(true);
    try {
      const token = localStorage.getItem('providerToken');
      const res = await fetch(`${BASE_URL}/api/tour-bookings/${selectedBooking._id}/complete`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to mark as complete');
      setSelectedBooking({ ...selectedBooking, bookingStatus: 'completed' });
      setShowReviewForm(true);
      setTourBookings(prev => prev.map(b => b._id === selectedBooking._id ? { ...b, bookingStatus: 'completed' } : b));
    } catch (err) {
      setModalError(err.message);
    }
    setCompleting(false);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;
    const token = localStorage.getItem('providerToken');
    if (!token) {
      setModalError('You must be logged in as a service provider to submit a review.');
      setTimeout(() => window.location.href = '/service-provider/login', 1500);
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/tour-bookings/${selectedBooking._id}/review`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reviewerType: 'guide', rating: review.rating, comment: review.comment }),
      });
      if (!res.ok) {
        let data = {};
        try { data = await res.json(); } catch (err) { console.error('Error parsing response JSON:', err); }
        setModalError(data.message || 'Failed to submit review');
        return;
      }
      setReviewed(true);
      setShowReviewForm(false);
    } catch (err) {
      setModalError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-100 to-gray-200">
      <TourGuideHeader />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick pauseOnHover />
      
      <div className="flex-grow container mx-auto p-6 md:p-10 mt-20 mb-12">
        {error && (
          <p className="text-red-600 text-center mb-6 font-medium bg-red-100 py-3 rounded-lg">{error}</p>
        )}
        
        {isLoading ? (
          <div className="text-center">
            <p className="text-gray-600 text-lg">Loading...</p>
            <div className="loader ease-linear rounded-full border-4 border-t-4 border-green-500 h-12 w-12 mx-auto mt-4 animate-spin"></div>
          </div>
        ) : tourGuide ? (
          <div className="grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <div className="col-span-12 md:col-span-3 lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="flex flex-col space-y-2">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-4 py-2 rounded-lg text-left ${
                      activeTab === 'overview'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('bookings')}
                    className={`px-4 py-2 rounded-lg text-left ${
                      activeTab === 'bookings'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Bookings
                  </button>
                  <button
                    onClick={() => setActiveTab('packages')}
                    className={`px-4 py-2 rounded-lg text-left ${
                      activeTab === 'packages'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Tour Packages
                  </button>
                  <button
                    onClick={() => setActiveTab('reviews')}
                    className={`px-4 py-2 rounded-lg text-left ${
                      activeTab === 'reviews'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Reviews
                  </button>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`px-4 py-2 rounded-lg text-left ${
                      activeTab === 'profile'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Profile Settings
                  </button>
                  <button
                    onClick={() => setActiveTab('payments')}
                    className={`px-4 py-2 rounded-lg text-left ${
                      activeTab === 'payments'
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 text-white'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    Earnings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-lg text-left text-red-600 hover:bg-red-50 mt-4"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Recent Bookings</h3>
                    <div className="text-3xl font-bold text-green-600">{tourBookings.length}</div>
                    <p className="text-gray-600">Total Bookings</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Tour Packages</h3>
                    <div className="text-3xl font-bold text-blue-600">{tourPackages.length}</div>
                    <p className="text-gray-600">Active Packages</p>
                  </div>
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4">Rating</h3>
                    <div className="text-3xl font-bold text-yellow-600">{averageRating.toFixed(1)}/5.0</div>
                    <p className="text-gray-600">{reviews.length} Reviews</p>
                  </div>
                </div>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Tour Bookings</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tourist</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Package</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Date</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {tourBookings.map((booking) => (
                          <tr key={booking._id} onClick={() => handleViewBooking(booking._id)} style={{ cursor: 'pointer' }}>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-gray-900">{booking.email}</div>
                              <div className="text-sm text-gray-500">{booking.phone}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{booking.packageId?.title || 'N/A'}</div>
                              <div className="text-sm text-gray-500">{booking.travelersCount} travelers</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                {new Date(booking.travelDate).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                ${(booking.bookingStatus === 'pending' || booking.status === 'pending') ? 'bg-yellow-100 text-yellow-800' : 
                                  (booking.bookingStatus === 'confirmed' || booking.status === 'confirmed') ? 'bg-green-100 text-green-800' : 
                                  (booking.bookingStatus === 'cancelled' || booking.status === 'cancelled') ? 'bg-gray-200 text-gray-600' :
                                  (booking.bookingStatus === 'approved' || booking.status === 'approved') ? 'bg-blue-100 text-blue-800' :
                                  (booking.bookingStatus === 'rejected' || booking.status === 'rejected') ? 'bg-red-100 text-red-800' :
                                  (booking.bookingStatus === 'completed' || booking.status === 'completed') ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'}`}>
                                {(booking.bookingStatus === 'completed' || booking.status === 'completed') && (booking.bookingStatus !== 'rejected' && booking.status !== 'rejected') ? (
                                  'Completed'
                                ) : (booking.bookingStatus === 'rejected' || booking.status === 'rejected') ? (
                                  'Rejected'
                                ) : (
                                  booking.bookingStatus || booking.status
                                )}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {booking.bookingStatus === 'pending' && (
                                <div className="space-x-2">
                                  <button
                                    onClick={e => { e.stopPropagation(); handleBookingStatusUpdate(booking._id, 'approved'); }}
                                    className="bg-blue-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-blue-600"
                                  >
                                    Approve
                                  </button>
                                  <button
                                    onClick={e => { e.stopPropagation(); handleBookingStatusUpdate(booking._id, 'rejected'); }}
                                    className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600"
                                  >
                                    Reject
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Packages Tab */}
              {activeTab === 'packages' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Tour Packages</h2>
                    {tourGuide.verificationStatus === 'verified' && (
                      <Link
                        to="/tour-guide/create-package"
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-teal-600"
                      >
                        Create New Package
                      </Link>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tourPackages.map((pkg) => (
                      <div key={pkg._id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
                        <h3 className="text-xl font-semibold mb-2">{pkg.title}</h3>
                        <p className="text-gray-600 mb-2">{pkg.description}</p>
                        <div className="flex justify-between items-center text-sm text-gray-500 mb-4">
                          <span>Price: ${pkg.price}</span>
                          <span>Duration: {pkg.duration}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium
                            ${pkg.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {pkg.status}
                          </span>
                          <div className="space-x-2">
                            {pkg.status === 'draft' && (
                              <button
                                onClick={() => handlePublish(pkg._id)}
                                className="text-green-600 hover:text-green-800"
                              >
                                Publish
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(pkg._id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews Tab */}
              {activeTab === 'reviews' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Reviews</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border rounded-xl p-4 hover:shadow-lg transition-shadow">
                        <div className="flex items-center mb-2">
                          <div className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                            {review.touristId?.username?.[0]?.toUpperCase() || 'A'}
                          </div>
                          <div>
                            <h4 className="font-medium">{review.touristId?.username || 'Anonymous'}</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <svg
                                  key={i}
                                  className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.95-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600">{review.comment}</p>
                        <p className="text-sm text-gray-500 mt-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Profile Settings Tab */}
              {activeTab === 'profile' && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Profile Picture</h3>
                      <div className="mb-4">
                        <img
                          src={tourGuide.profilePicture ? `${BASE_URL}${tourGuide.profilePicture}` : 'https://via.placeholder.com/150'}
                          alt="Profile"
                          className="w-32 h-32 rounded-full object-cover"
                        />
                      </div>
                      <input
                        type="file"
                        onChange={(e) => setProfilePictureFile(e.target.files[0])}
                        className="hidden"
                        id="profile-picture"
                      />
                      <label
                        htmlFor="profile-picture"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
                      >
                        Choose New Picture
                      </label>
                      {profilePictureFile && (
                        <button
                          onClick={handleUpdateProfilePicture}
                          className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Banner Image</h3>
                      <div className="mb-4">
                        <img
                          src={tourGuide.banner ? `${BASE_URL}${tourGuide.banner}` : 'https://via.placeholder.com/800x200'}
                          alt="Banner"
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <input
                        type="file"
                        onChange={(e) => setBannerFile(e.target.files[0])}
                        className="hidden"
                        id="banner-image"
                      />
                      <label
                        htmlFor="banner-image"
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-200"
                      >
                        Choose New Banner
                      </label>
                      {bannerFile && (
                        <button
                          onClick={handleUpdateBanner}
                          className="ml-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                        >
                          Upload
                        </button>
                      )}
                    </div>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Languages</label>
                      <input
                        type="text"
                        name="languages"
                        value={formData.languages.join(', ')}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="English, Spanish, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                      <input
                        type="number"
                        name="yearsOfExperience"
                        value={formData.yearsOfExperience}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Certification</label>
                      <input
                        type="text"
                        name="certification"
                        value={formData.certification}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-2 rounded-lg hover:from-green-600 hover:to-teal-600"
                      >
                        Save Changes
                      </button>
                    </div>
                  </form>

                  {/* Bank Details Section */}
                  <div className="mt-10">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Bank Details</h3>
                    {bankSuccess && <p className="text-green-600 mb-2">{bankSuccess}</p>}
                    {bankError && <p className="text-red-500 mb-2">{bankError}</p>}
                    {bankDetails.accountHolderName ? (
                      <form onSubmit={handleBankSubmit}>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="accountHolderName">Account Holder Name</label>
                          <input
                            type="text"
                            id="accountHolderName"
                            name="accountHolderName"
                            value={bankDetails.accountHolderName}
                            onChange={handleBankChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="bankName">Bank Name</label>
                          <input
                            type="text"
                            id="bankName"
                            name="bankName"
                            value={bankDetails.bankName}
                            onChange={handleBankChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="accountNumber">Account Number</label>
                          <input
                            type="text"
                            id="accountNumber"
                            name="accountNumber"
                            value={bankDetails.accountNumber}
                            onChange={handleBankChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                          />
                        </div>
                        <div className="mb-4">
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="branch">Branch</label>
                          <input
                            type="text"
                            id="branch"
                            name="branch"
                            value={bankDetails.branch}
                            onChange={handleBankChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <div className="mb-6">
                          <label className="block text-gray-700 font-semibold mb-2" htmlFor="swiftCode">SWIFT Code</label>
                          <input
                            type="text"
                            id="swiftCode"
                            name="swiftCode"
                            value={bankDetails.swiftCode}
                            onChange={handleBankChange}
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-gradient-to-r from-green-600 to-green-800 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-900 transition-all shadow-md"
                        >
                          Update Bank Details
                        </button>
                      </form>
                    ) : (
                      <div className="text-gray-500">No bank details added yet.</div>
                    )}
                  </div>
                </div>
              )}

              {/* Payments/Earnings Tab */}
              {activeTab === 'payments' && (
                <TourGuideEarnings tourGuide={tourGuide} />
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-600 text-lg">No tour guide data available.</p>
        )}
      </div>
      <Footer />

      {/* Booking Details Modal */}
      <Modal
        isOpen={!!selectedBooking}
        onRequestClose={() => { setSelectedBooking(null); setReviewed(false); setReview({ rating: 5, comment: '' }); setModalError(''); setShowReviewForm(false); }}
        ariaHideApp={false}
        className="fixed inset-0 flex items-center justify-center z-50"
        overlayClassName="fixed inset-0 z-40"
        style={{ overlay: { background: "rgba(30, 41, 59, 0.15)", backdropFilter: "blur(2px)" } }}
      >
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
          <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" onClick={() => { setSelectedBooking(null); setReviewed(false); setReview({ rating: 5, comment: '' }); setModalError(''); setShowReviewForm(false); }}>&times;</button>
          {modalLoading ? (
            <div>Loading...</div>
          ) : modalError ? (
            <div className="text-red-600">{modalError}</div>
          ) : selectedBooking ? (
            <>
              <h3 className="text-xl font-bold mb-2">Booking Details</h3>
              <div className="space-y-1 text-sm mb-4">
                <div><b>Booking ID:</b> {selectedBooking._id}</div>
                <div><b>Tourist:</b> {selectedBooking.userId?.username || selectedBooking.email}</div>
                <div><b>Email:</b> {selectedBooking.userId?.email || selectedBooking.email}</div>
                <div><b>Phone:</b> {selectedBooking.userId?.phoneNumber || selectedBooking.phone}</div>
                <div><b>Country:</b> {selectedBooking.userId?.country || selectedBooking.country}</div>
                <div><b>Tour Package:</b> {selectedBooking.packageId?.title || 'N/A'}</div>
                <div><b>Travelers:</b> {selectedBooking.travelersCount}</div>
                <div><b>Travel Date:</b> {selectedBooking.travelDate ? new Date(selectedBooking.travelDate).toLocaleDateString() : '-'}</div>
                <div><b>Status:</b> {selectedBooking.bookingStatus}</div>
                <div><b>Total Price:</b> ${selectedBooking.totalPrice}</div>
              </div>
              {selectedBooking.bookingStatus !== 'completed' && (
                <button onClick={handleCompleteBooking} disabled={completing} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4">
                  {completing ? 'Completing...' : 'Mark as Complete'}
                </button>
              )}
              {((selectedBooking.bookingStatus === 'completed' && !reviewed) || showReviewForm) && (
                <form onSubmit={handleReviewSubmit} className="mt-4">
                  <h4 className="font-semibold mb-2">Leave a Review for Tourist</h4>
                  <label className="block mb-2">Rating:
                    <select value={review.rating} onChange={e => setReview({ ...review, rating: e.target.value })} className="ml-2">
                      {[5,4,3,2,1].map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </label>
                  <label className="block mb-2">Comment:
                    <textarea value={review.comment} onChange={e => setReview({ ...review, comment: e.target.value })} required className="w-full border rounded p-2 mt-1" />
                  </label>
                  <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Submit Review</button>
                </form>
              )}
              {reviewed && <div className="text-green-600 mt-2">Thank you for your review!</div>}
            </>
          ) : null}
        </div>
      </Modal>
      {/* End of Modal */}
    </div>
  );
};

export default TourGuideDashboard;