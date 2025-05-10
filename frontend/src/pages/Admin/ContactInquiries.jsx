import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../components/AdminHeader';
import SidebarAdmin from '../../components/SidebarAdmin';
import { FaEnvelope, FaPhone, FaReply, FaCheck, FaTimes } from 'react-icons/fa';

const AdminContactInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/contact-inquiries`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Sort inquiries by createdAt descending
      const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setInquiries(sorted);
    } catch {
      setError('Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReplied = async (id) => {
    setActionLoading(id);
    try {
      const token = localStorage.getItem('adminToken');
      await axios.patch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/contact-inquiries/${id}/reply`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInquiries(prev => prev.map(i => i._id === id ? { ...i, replied: true } : i));
    } catch {
      alert('Failed to mark as replied.');
    } finally {
      setActionLoading('');
    }
  };

  const filteredInquiries = inquiries.filter(i => {
    if (filter === 'all') return true;
    if (filter === 'replied') return i.replied;
    if (filter === 'unreplied') return !i.replied;
    return true;
  });

  if (loading) return <div className="flex justify-center items-center h-64 text-lg font-semibold text-blue-600">Loading inquiries...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-lg font-semibold text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-200 flex">
      <SidebarAdmin />
      <div className="flex-1 md:ml-64">
        <AdminHeader />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-8 bg-white/95 rounded-none md:rounded-3xl shadow-2xl mt-6 md:mt-12 mb-6 md:mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-800 flex items-center gap-4">
              <FaEnvelope className="text-blue-500 text-3xl" /> Contact Form Inquiries
            </h2>
            <div className="flex gap-3 items-center flex-wrap">
              <span className="inline-block bg-blue-100 text-blue-700 px-5 py-2 rounded-full text-base font-semibold shadow">{filteredInquiries.length} Showing</span>
              <select
                className="border border-blue-200 rounded-lg px-4 py-2 text-blue-700 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-sm"
                value={filter}
                onChange={e => setFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="unreplied">Unreplied</option>
                <option value="replied">Replied</option>
              </select>
            </div>
          </div>
          {filteredInquiries.length === 0 ? (
            <div className="text-center text-gray-500 py-20 text-lg font-medium">No inquiries found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
              {filteredInquiries.map((inq) => (
                <div
                  key={inq._id}
                  className={`rounded-2xl shadow-2xl border border-blue-100 bg-gradient-to-br from-white to-blue-50 p-6 sm:p-8 flex flex-col gap-5 relative transition-all duration-200 ${inq.replied ? 'opacity-70' : 'opacity-100'} hover:shadow-blue-200`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                    <span className="font-bold text-lg sm:text-xl text-blue-900 tracking-wide">{inq.firstName} {inq.lastName}</span>
                    {inq.replied ? (
                      <span className="ml-0 sm:ml-3 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs flex items-center gap-1"><FaCheck className="inline" />Replied</span>
                    ) : (
                      <span className="ml-0 sm:ml-3 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs flex items-center gap-1"><FaTimes className="inline" />Unreplied</span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 mb-2">
                    <span className="text-blue-700 font-semibold flex items-center gap-2 cursor-pointer hover:underline break-all text-base" onClick={() => window.open(`mailto:${inq.email}`)}><FaEnvelope /> {inq.email}</span>
                    <span className="text-blue-700 font-semibold flex items-center gap-2 cursor-pointer hover:underline break-all text-base" onClick={() => window.open(`tel:${inq.phone}`)}><FaPhone /> {inq.phone}</span>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 text-gray-800 mb-2 shadow-inner break-words text-base min-h-[60px] flex items-center">
                    <span className="font-medium">{inq.message}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-3">
                    <span className="text-xs text-gray-500 font-medium">{new Date(inq.createdAt).toLocaleString()}</span>
                    {!inq.replied && (
                      <button
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-5 py-2 rounded-lg text-sm font-bold shadow transition disabled:opacity-60"
                        onClick={() => handleMarkAsReplied(inq._id)}
                        disabled={actionLoading === inq._id}
                      >
                        {actionLoading === inq._id ? 'Marking...' : (<><FaReply /> Mark as Replied</>)}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="mt-12 text-base text-gray-500 text-center">
            To address an inquiry, you can reply directly via email or phone using the action buttons.<br />
            Mark as replied after you have responded.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContactInquiries;
