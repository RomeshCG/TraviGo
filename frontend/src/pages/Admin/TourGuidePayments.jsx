import { useState, useEffect, useRef } from "react";
import { FaSearch, FaSyncAlt, FaInfoCircle, FaMoneyCheckAlt, FaUndoAlt } from "react-icons/fa";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";
import BankDetailsModal from "../../components/BankDetailsModal";
import axios from "axios";

const TourGuidePayments = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [cashoutRequests, setCashoutRequests] = useState([]);
  const [cashoutLoading, setCashoutLoading] = useState(true);
  const [selectedBankDetails, setSelectedBankDetails] = useState(null);
  const [showBankModal, setShowBankModal] = useState(false);
  const searchInput = useRef();
  const [bankLoading, setBankLoading] = useState(false);

  // Set axios default headers with admin token
  const token = localStorage.getItem('adminToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("/api/admin/tour-guide-bookings");
        // Sort bookings by createdAt descending
        const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setBookings(sorted);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();

    // Fetch cashout requests for admin
    const fetchCashoutRequests = async () => {
      try {
        const response = await axios.get("/api/admin/cashout-requests");
        // Sort cashout requests by createdAt descending
        const sorted = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCashoutRequests(sorted);
      } catch {
        // Optionally handle error
      } finally {
        setCashoutLoading(false);
      }
    };
    fetchCashoutRequests();
  }, []);

  useEffect(() => {
    setSuccess(null);
  }, [bookings]);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filter ? b.bookingStatus === filter : true;
    const matchesSearch = search
      ? [b.userId?.username, b.guideId?.name, b.packageId?.title, b.email]
          .filter(Boolean)
          .some((field) => field.toLowerCase().includes(search.toLowerCase()))
      : true;
    return matchesStatus && matchesSearch;
  });

  const handleRefund = async (id) => {
    if (!window.confirm("Process refund for this booking?")) return;
    try {
      await axios.post(`/api/admin/tour-guide-bookings/${id}/refund`);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, refundRequested: false, adminNotified: false, bookingStatus: 'cancelled' } : b));
      setSuccess("Refund processed successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Refund failed.");
    }
  };

  // Release payment and set bookingStatus to 'approved' if not already
  const handleReleasePayment = async (id, currentStatus) => {
    if (!window.confirm("Release payment for this booking?")) return;
    try {
      // Set paymentStatus to 'released' (TraviGo balance)
      await axios.put(`/api/tour-bookings/${id}/payment-status`, { paymentStatus: 'released' });
      // Optionally, also set bookingStatus to 'approved' if not already
      if (currentStatus !== 'approved') {
        await axios.put(`/api/tour-bookings/${id}/booking-status`, { bookingStatus: 'approved' });
      }
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, paymentStatus: 'released', bookingStatus: 'approved' } : b));
      setSuccess("Payment released to TraviGo balance and booking marked as approved.");
    } catch (error) {
      setError(error.response?.data?.message || "Payment release failed.");
    }
  };

  // Approve cashout (admin marks payout as completed)
  const handlePayout = async (id) => {
    if (!window.confirm("Approve cashout for this booking?")) return;
    try {
      await axios.put(`/api/tour-bookings/${id}/payment-status`, { paymentStatus: 'cashout_done' });
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, paymentStatus: 'cashout_done', cashoutAmount: 0 } : b));
      setSuccess("Cashout approved and marked as completed.");
    } catch (error) {
      setError(error.response?.data?.message || "Cashout approval failed.");
    }
  };

  // Approve a cashout request (admin)
  const handleApproveCashoutRequest = async (requestId) => {
    if (!window.confirm("Approve this cashout request?")) return;
    try {
      await axios.post(`/api/admin/cashout-requests/${requestId}/approve`);
      setCashoutRequests((prev) => prev.filter((r) => r._id !== requestId));
      setSuccess("Cashout request approved and marked as completed.");
    } catch (error) {
      setError(error.response?.data?.message || "Cashout approval failed.");
    }
  };

  // Reject a cashout request (admin)
  const handleRejectCashoutRequest = async (requestId) => {
    if (!window.confirm("Reject this cashout request?")) return;
    try {
      await axios.post(`/api/admin/cashout-requests/${requestId}/reject`);
      setCashoutRequests((prev) => prev.filter((r) => r._id !== requestId));
      setSuccess("Cashout request rejected.");
    } catch (error) {
      setError(error.response?.data?.message || "Cashout rejection failed.");
    }
  };

  const handleViewBank = async (tourGuide) => {
    if (tourGuide?.bankDetails) {
      setSelectedBankDetails(tourGuide.bankDetails);
      setShowBankModal(true);
    } else if (tourGuide?._id) {
      setBankLoading(true);
      try {
        const res = await axios.get(`/api/tourguides/${tourGuide._id}`);
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

  const statusBadge = (status) => {
    const color = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-blue-100 text-blue-800",
      rejected: "bg-red-100 text-red-800",
      confirmed: "bg-green-100 text-green-800",
      cancelled: "bg-gray-200 text-gray-700",
    }[status] || "bg-gray-100 text-gray-700";
    return <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>{status}</span>;
  };

  const getGuideSummary = (bookings) => {
    // Group by guideId and sum payoutReady bookings' cashoutAmount
    const summary = {};
    bookings.forEach(b => {
      if ((b.paymentStatus === 'payout_ready' || b.paymentStatus === 'payout_requested') && b.guideId?._id) {
        if (!summary[b.guideId._id]) {
          summary[b.guideId._id] = {
            guide: b.guideId,
            total: 0,
          };
        }
        summary[b.guideId._id].total += Number(b.cashoutAmount || b.totalPrice || 0);
      }
    });
    return Object.values(summary);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Tour Guide Payment Manager</h2>

            {/* --- New: Pending Cashout Requests Table --- */}
            <div className="mb-8">
              <h3 className="font-bold mb-2 text-blue-800 text-lg">Pending Cashout Requests (Requested Amount Only)</h3>
              {cashoutLoading ? (
                <p>Loading cashout requests...</p>
              ) : cashoutRequests.length === 0 ? (
                <p className="text-gray-500">No pending cashout requests.</p>
              ) : (
                <div className="overflow-x-auto mb-4">
                  <table className="min-w-full bg-white rounded-lg shadow">
                    <thead>
                      <tr>
                        <th className="p-2">Tour Guide</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Location</th>
                        <th className="p-2">Requested Amount</th>
                        <th className="p-2">Bookings</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cashoutRequests.map((req) => (
                        <tr key={req._id} className="border-b hover:bg-blue-50 transition">
                          <td className="p-2">{req.tourGuideId?.name || '-'}</td>
                          <td className="p-2">{req.tourGuideId?.email || '-'}</td>
                          <td className="p-2">{req.tourGuideId?.location || '-'}</td>
                          <td className="p-2 text-green-700 font-bold">${Number(req.amount).toFixed(2)}</td>
                          <td className="p-2 text-xs">
                            {req.bookings && req.bookings.length > 0 ? (
                              <ul className="list-disc pl-4">
                                {req.bookings.map((b, idx) => (
                                  <li key={b._id || idx}>
                                    {(b._id ? b._id.slice(-6) : '-') +
                                      ' ($' + Number(b.cashoutAmount || 0).toFixed(2) + ')'}
                                  </li>
                                ))}
                              </ul>
                            ) : '-'}
                          </td>
                          <td className="p-2 space-x-2">
                            <button onClick={() => handleApproveCashoutRequest(req._id)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs" title="Approve Cashout">Approve</button>
                            <button onClick={() => handleRejectCashoutRequest(req._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs" title="Reject Cashout">Reject</button>
                            <button onClick={() => handleViewBank(req.tourGuideId)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs" title="View Bank Details">Bank</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            {/* --- End New: Pending Cashout Requests Table --- */}

            {/* --- Admin Cashout Requests Section --- */}
            {(() => {
              const payoutSummary = getGuideSummary(filteredBookings);
              return payoutSummary.length > 0 && (
                <div className="mb-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h3 className="font-bold mb-2 text-blue-800 text-lg">Pending Cashout Requests</h3>
                  <ul className="list-disc pl-6 mb-2">
                    {payoutSummary.map(s => (
                      <li key={s.guide._id}>
                        <span className="font-semibold">{s.guide.name}:</span> <span className="text-green-700 font-bold">${s.total.toFixed(2)}</span> to pay
                      </li>
                    ))}
                  </ul>
                  <p className="text-sm text-blue-700">Approve cashout requests using the green button in the table below.</p>
                </div>
              );
            })()}
            {/* --- End Admin Cashout Requests Section --- */}

            {/* --- Booking Management Section --- */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <div className="relative">
                <input
                  ref={searchInput}
                  type="text"
                  placeholder="Search by tourist, guide, or package..."
                  className="pl-8 pr-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring w-64"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <FaSearch className="absolute left-2 top-3 text-gray-400" />
              </div>
              <select
                className="p-2 rounded border border-gray-300"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="confirmed">Confirmed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <button
                className="ml-2 p-2 bg-gray-200 rounded hover:bg-gray-300"
                title="Clear filters"
                onClick={() => { setFilter(""); setSearch(""); searchInput.current.value = ""; }}
              >
                <FaSyncAlt />
              </button>
            </div>
            {success && <div className="mb-2 p-2 bg-green-100 text-green-700 rounded">{success}</div>}
            {error && <div className="mb-2 p-2 bg-red-100 text-red-700 rounded-lg">{error}</div>}
            {loading ? (
              <p>Loading bookings...</p>
            ) : filteredBookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg shadow">
                  <thead>
                    <tr>
                      <th className="p-2">Booking ID</th>
                      <th className="p-2">Tourist</th>
                      <th className="p-2">Guide</th>
                      <th className="p-2">Package</th>
                      <th className="p-2">Status</th>
                      <th className="p-2">Refund</th>
                      <th className="p-2">Payout</th>
                      <th className="p-2">Payout Amount</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b) => (
                      <tr key={b._id} className="border-b hover:bg-pink-50 transition cursor-pointer">
                        <td className="p-2 text-xs" onClick={() => setSelectedBooking(b)} title="View details">{b._id.slice(-6)}</td>
                        <td className="p-2" onClick={() => setSelectedBooking(b)}>{b.userId?.username || b.email}</td>
                        <td className="p-2" onClick={() => setSelectedBooking(b)}>{b.guideId?.name || '-'}</td>
                        <td className="p-2" onClick={() => setSelectedBooking(b)}>{b.packageId?.title || '-'}</td>
                        <td className="p-2">{statusBadge(b.bookingStatus)}</td>
                        <td className="p-2">{b.refundRequested ? <span className="text-red-500 font-bold">Requested</span> : '-'}</td>
                        <td className="p-2">{b.paymentStatus === 'cashout_pending' ? <span className="text-yellow-700 font-bold">Pending Cashout</span> : b.paymentStatus === 'cashout_done' ? <span className="text-green-700 font-bold">Cashed Out</span> : b.paymentStatus === 'released' ? <span className="text-blue-700 font-bold">In TraviGo Balance</span> : '-'}</td>
                        <td className="p-2">{b.cashoutAmount ? `$${Number(b.cashoutAmount).toFixed(2)}` : '-'}</td>
                        <td className="p-2 space-x-2">
                          {b.refundRequested && (
                            <button onClick={() => handleRefund(b._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs" title="Process Refund"><FaUndoAlt /></button>
                          )}
                          {b.paymentStatus === 'cashout_pending' && (
                            <button onClick={() => handlePayout(b._id)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs" title="Approve Cashout"><FaMoneyCheckAlt /></button>
                          )}
                          {b.paymentStatus === 'holding' && b.bookingStatus === 'approved' && (
                            <button onClick={() => handleReleasePayment(b._id, b.bookingStatus)} className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-xs" title="Release Payment">Release Payment</button>
                          )}
                          <button onClick={() => setSelectedBooking(b)} className="bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 text-xs" title="View Details"><FaInfoCircle /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Modal for booking details */}
            {selectedBooking && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-700" onClick={() => setSelectedBooking(null)}>&times;</button>
                  <h3 className="text-xl font-bold mb-2">Booking Details</h3>
                  <div className="space-y-1 text-sm">
                    <div><b>Booking ID:</b> {selectedBooking._id}</div>
                    <div><b>Tourist:</b> {selectedBooking.userId?.username || selectedBooking.email}</div>
                    <div><b>Guide:</b> {selectedBooking.guideId?.name || '-'}</div>
                    <div><b>Package:</b> {selectedBooking.packageId?.title || '-'}</div>
                    <div><b>Status:</b> {statusBadge(selectedBooking.bookingStatus)}</div>
                    <div><b>Travel Date:</b> {selectedBooking.travelDate ? new Date(selectedBooking.travelDate).toLocaleDateString() : '-'}</div>
                    <div><b>Travelers:</b> {selectedBooking.travelersCount}</div>
                    <div><b>Country:</b> {selectedBooking.country}</div>
                    <div><b>Phone:</b> {selectedBooking.phone}</div>
                    <div><b>Email:</b> {selectedBooking.email}</div>
                    <div><b>Refund Requested:</b> {selectedBooking.refundRequested ? "Yes" : "No"}</div>
                    <div><b>Payout Ready:</b> {selectedBooking.paymentStatus === 'payout_ready' || selectedBooking.paymentStatus === 'payout_requested' ? "Yes" : "No"}</div>
                    <div><b>Payout Amount:</b> {selectedBooking.cashoutAmount ? `$${Number(selectedBooking.cashoutAmount).toFixed(2)}` : '-'}</div>
                  </div>
                </div>
              </div>
            )}
            {/* Modal for bank details */}
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

export default TourGuidePayments;
