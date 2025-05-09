import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <svg className="w-7 h-7 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8s-9-3.582-9-8 4.03-8 9-8 9 3.582 9 8z" /></svg>
        Contact Form Inquiries
      </h2>
      {inquiries.length === 0 ? (
        <div className="text-center text-gray-500 py-12 text-lg">No inquiries found.</div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Email</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Phone</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Message</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {inquiries.map((inq) => (
                <tr key={inq._id} className="hover:bg-blue-50 transition">
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">{inq.firstName} {inq.lastName}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-blue-700 underline cursor-pointer hover:text-blue-900" onClick={() => window.open(`mailto:${inq.email}`)}>{inq.email}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-700">{inq.phone}</td>
                  <td className="px-4 py-3 max-w-xs text-gray-700 truncate" title={inq.message}>{inq.message}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-500">{new Date(inq.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                      onClick={() => window.open(`mailto:${inq.email}`)}
                    >Reply Email</button>
                    <button
                      className="ml-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold transition"
                      onClick={() => window.open(`tel:${inq.phone}`)}
                    >Call</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="mt-6 text-sm text-gray-500 text-center">
        To address an inquiry, you can reply directly via email or phone using the action buttons.
      </div>
    </div>
  );
};

export default AdminContactInquiries;
