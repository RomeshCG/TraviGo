import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminHeader from '../../components/AdminHeader';
import SidebarAdmin from '../../components/SidebarAdmin';

const AdminContactInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/admin/contact-inquiries`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setInquiries(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch inquiries');
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-64 text-lg font-semibold text-blue-600">Loading inquiries...</div>;
  if (error) return <div className="flex justify-center items-center h-64 text-lg font-semibold text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <SidebarAdmin />
      <div className="md:ml-64 flex-1">
        <AdminHeader />
        <div className="max-w-6xl mx-auto p-6 bg-white/90 rounded-2xl shadow-2xl mt-10 mb-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold text-blue-800 flex items-center gap-3">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
              Contact Form Inquiries
            </h2>
            <span className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-semibold shadow">{inquiries.length} Total</span>
          </div>
          {inquiries.length === 0 ? (
            <div className="text-center text-gray-500 py-16 text-lg font-medium">No inquiries found.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-100 to-blue-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-blue-800 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-50">
                  {inquiries.map((inq, idx) => (
                    <tr key={inq._id} className={`transition-all duration-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100/70`}>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">{inq.firstName} {inq.lastName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-700 underline cursor-pointer hover:text-blue-900" onClick={() => window.open(`mailto:${inq.email}`)}>{inq.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">{inq.phone}</td>
                      <td className="px-6 py-4 max-w-xs text-gray-700 truncate" title={inq.message}>{inq.message}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">{new Date(inq.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap flex gap-2">
                        <button
                          className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition"
                          onClick={() => window.open(`mailto:${inq.email}`)}
                        >Reply Email</button>
                        <button
                          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow transition"
                          onClick={() => window.open(`tel:${inq.phone}`)}
                        >Call</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="mt-8 text-sm text-gray-500 text-center">
            To address an inquiry, you can reply directly via email or phone using the action buttons.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminContactInquiries;
