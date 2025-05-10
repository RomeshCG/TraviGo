import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminContactInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const token = localStorage.getItem('adminToken'); // Adjust if you use a different storage/key
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

  if (loading) return <div>Loading inquiries...</div>;
  if (error) return <div style={{color:'red'}}>Error: {error}</div>;

  return (
    <div className="admin-contact-inquiries">
      <h2>Contact Form Inquiries</h2>
      {inquiries.length === 0 ? (
        <p>No inquiries found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id}>
                <td>{inq.firstName} {inq.lastName}</td>
                <td>{inq.email}</td>
                <td>{inq.phone}</td>
                <td>{inq.message}</td>
                <td>{new Date(inq.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <p style={{marginTop:16, color:'#888'}}>To address an inquiry, please reply via email or phone.</p>
    </div>
  );
};

export default AdminContactInquiries;
