import { useState, useEffect, useRef } from "react";
import { FaSearch, FaSyncAlt, FaInfoCircle, FaMoneyCheckAlt, FaUndoAlt } from "react-icons/fa";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";

const TourGuidePayments = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const searchInput = useRef();

  // Set axios default headers with admin token
  const token = localStorage.getItem('adminToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("/api/admin/tour-guide-bookings");
        setBookings(response.data);
        setError(null);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    setSuccess(null);
  }, [bookings]);

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filter ? b.status === filter : true;
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
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, refundRequested: false, adminNotified: false, status: 'cancelled' } : b));
      setSuccess("Refund processed successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Refund failed.");
    }
  };

  const handlePayout = async (id) => {
    if (!window.confirm("Approve payout for this booking?")) return;
    try {
      await axios.post(`/api/admin/tour-guide-bookings/${id}/payout`);
      setBookings((prev) => prev.map((b) => b._id === id ? { ...b, payoutReady: false, status: 'confirmed' } : b));
      setSuccess("Payout approved successfully.");
    } catch (error) {
      setError(error.response?.data?.message || "Payout failed.");
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

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Tour Guide Payment Manager</h2>
            {/* Search and Filter */}
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
                        <td className="p-2">{statusBadge(b.status)}</td>
                        <td className="p-2">{b.refundRequested ? <span className="text-red-500 font-bold">Requested</span> : '-'}</td>
                        <td className="p-2">{b.payoutReady ? <span className="text-green-600 font-bold">Ready</span> : '-'}</td>
                        <td className="p-2 space-x-2">
                          {b.refundRequested && (
                            <button onClick={() => handleRefund(b._id)} className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-xs" title="Process Refund"><FaUndoAlt /></button>
                          )}
                          {b.payoutReady && (
                            <button onClick={() => handlePayout(b._id)} className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 text-xs" title="Approve Payout"><FaMoneyCheckAlt /></button>
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
                    <div><b>Status:</b> {statusBadge(selectedBooking.status)}</div>
                    <div><b>Travel Date:</b> {selectedBooking.travelDate ? new Date(selectedBooking.travelDate).toLocaleDateString() : '-'}</div>
                    <div><b>Travelers:</b> {selectedBooking.travelersCount}</div>
                    <div><b>Country:</b> {selectedBooking.country}</div>
                    <div><b>Phone:</b> {selectedBooking.phone}</div>
                    <div><b>Email:</b> {selectedBooking.email}</div>
                    <div><b>Refund Requested:</b> {selectedBooking.refundRequested ? "Yes" : "No"}</div>
                    <div><b>Payout Ready:</b> {selectedBooking.payoutReady ? "Yes" : "No"}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourGuidePayments;
