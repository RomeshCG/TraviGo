import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";
import BankDetailsModal from "../../components/BankDetailsModal";
import { FaSearch } from "react-icons/fa";
import axios from "axios";

const TourGuide = () => {
  const [tourGuides, setTourGuides] = useState([]);
  const [error, setError] = useState(null);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const [search, setSearch] = useState("");
  const [bankLoading, setBankLoading] = useState(false);
  const navigate = useNavigate();

  // Set axios default headers with admin token
  const token = localStorage.getItem('adminToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    navigate('/admin/login'); // Redirect to login if no token
  }

  // Fetch tour guides from backend
  useEffect(() => {
    const fetchTourGuides = async () => {
      try {
        const response = await axios.get("/api/tourguides");
        setTourGuides(response.data); // Assuming the API returns an array of tour guides
        setError(null);
      } catch (error) {
        console.error("Error fetching tour guides:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError("Authentication failed. Please log in again.");
          setTimeout(() => navigate('/admin/login'), 2000); // Redirect after 2 seconds
        } else {
          setError(error.response?.data?.message || "Failed to fetch tour guides. Please try again later.");
        }
      }
    };
    fetchTourGuides();
  }, [navigate]);

  // Verify tour guide
  const handleVerify = async (id) => {
    try {
      const response = await axios.put(`/api/tourguides/verify/${id}`);
      setTourGuides((prev) =>
        prev.map((guide) =>
          guide._id === id
            ? { ...guide, ...response.data } // Update with full response data
            : guide
        )
      );
      setError(null);
    } catch (error) {
      console.error("Error verifying tour guide:", error);
      setError(error.response?.data?.message || "Failed to verify tour guide. Please try again.");
    }
  };

  // Unverify tour guide
  const handleUnverify = async (id) => {
    try {
      const response = await axios.put(`/api/tourguides/unverify/${id}`);
      setTourGuides((prev) =>
        prev.map((guide) =>
          guide._id === id
            ? { ...guide, ...response.data } // Update with full response data
            : guide
        )
      );
      setError(null);
    } catch (error) {
      console.error("Error unverifying tour guide:", error);
      setError(error.response?.data?.message || "Failed to unverify tour guide. Please try again.");
    }
  };

  // Ban/Unban tour guide
  const handleBanUnban = async (id, isCurrentlyBanned) => {
    try {
      const endpoint = isCurrentlyBanned ? `/api/tourguides/unban/${id}` : `/api/tourguides/ban/${id}`;
      const response = await axios.put(endpoint);
      setTourGuides((prev) =>
        prev.map((guide) =>
          guide._id === id
            ? { ...guide, ...response.data } // Update with full response data
            : guide
        )
      );
      setError(null);
    } catch (error) {
      console.error("Error banning/unbanning tour guide:", error);
      setError(error.response?.data?.message || "Failed to update ban status. Please try again.");
    }
  };

  // Delete tour guide
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this tour guide?")) {
      try {
        const response = await axios.delete(`/api/tourguides/${id}`);
        setTourGuides((prev) => prev.filter((guide) => guide._id !== id));
        setError(null);
        if (response.data.message) {
          // Optionally show success message
          console.log(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting tour guide:", error);
        setError(error.response?.data?.message || "Failed to delete tour guide. Please try again.");
      }
    }
  };

  // View bank details
  const handleViewBank = async (guide) => {
    if (guide?.bankDetails) {
      setSelectedBankDetails(guide.bankDetails);
      setShowBankModal(true);
    } else if (guide?._id) {
      setBankLoading(true);
      try {
        const res = await axios.get(`/api/tourguides/${guide._id}`);
        setSelectedBankDetails(res.data.bankDetails || null);
        setShowBankModal(true);
      } catch {
        setSelectedBankDetails(null);
        setShowBankModal(true);
      } finally {
        setBankLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Manage Tour Guides</h2>
            <div className="mb-4 flex items-center">
              <div className="relative w-full max-w-xs">
                <input
                  type="text"
                  placeholder="Search by name, location, or experience..."
                  className="pl-8 pr-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring w-full"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <FaSearch className="absolute left-2 top-3 text-gray-400" />
              </div>
            </div>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
              {tourGuides.length === 0 && !error ? (
                <p>No tour guides available.</p>
              ) : (
                tourGuides
                  .filter(guide => {
                    const q = search.toLowerCase();
                    return (
                      guide.name?.toLowerCase().includes(q) ||
                      guide.location?.toLowerCase().includes(q) ||
                      String(guide.yearsOfExperience || "").includes(q)
                    );
                  })
                  .map((guide) => (
                    <div
                      key={guide._id}
                      className="flex items-center justify-between p-4 bg-pink-50 rounded-lg shadow-md"
                    >
                      <div>
                        <span className="text-lg font-medium">{guide.name}</span>
                        <p className="text-sm text-gray-600">
                          Location: {guide.location || 'Not specified'} | 
                          Experience: {guide.yearsOfExperience || 0} years
                        </p>
                        <p className={`text-sm ${guide.verificationStatus === "verified" ? "text-green-500" : "text-red-500"}`}>
                          {guide.verificationStatus === "verified" ? "Verified ✅" : "Not Verified ❌"}
                        </p>
                        <p className={`text-sm ${guide.isBanned ? "text-red-500" : "text-green-500"}`}>
                          {guide.isBanned ? "Banned 🚫" : "Active 🟢"}
                        </p>
                      </div>
                      <div className="space-x-2 flex items-center">
                        <button
                          onClick={() => handleViewBank(guide)}
                          className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 text-sm"
                        >
                          View Bank Account
                        </button>
                        {guide.verificationStatus === "pending" ? (
                          <button
                            onClick={() => handleVerify(guide._id)}
                            className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 text-sm"
                          >
                            Verify
                          </button>
                        ) : guide.verificationStatus === "verified" ? (
                          <button
                            onClick={() => handleUnverify(guide._id)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 text-sm"
                          >
                            Unverify
                          </button>
                        ) : null}
                        <button
                          onClick={() => handleBanUnban(guide._id, guide.isBanned)}
                          className={`px-3 py-1 rounded-lg text-sm text-white ${
                            guide.isBanned
                              ? "bg-gray-500 hover:bg-gray-600"
                              : "bg-orange-500 hover:bg-orange-600"
                          }`}
                        >
                          {guide.isBanned ? "Unban" : "Ban"}
                        </button>
                        <button
                          onClick={() => handleDelete(guide._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
              )}
            </div>
            {showBankModal && (
              <BankDetailsModal
                bankDetails={selectedBankDetails}
                onClose={() => setShowBankModal(false)}
              >
                {bankLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-60 z-10 rounded-2xl">
                    <span className="text-blue-600 font-semibold text-lg">Loading bank details...</span>
                  </div>
                )}
              </BankDetailsModal>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuide;