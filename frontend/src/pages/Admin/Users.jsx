import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";
import axios from "axios";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Set axios default headers with admin token
  const token = localStorage.getItem('adminToken');
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    navigate('/admin/login');
  }

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users");
        setUsers(response.data);
        setError(null);
      } catch (error) {
        console.error("Error fetching users:", {
          message: error.message,
          response: error.response,
          request: error.request,
        });
        if (error.response?.status === 401 || error.response?.status === 403) {
          setError("Authentication failed. Please log in again.");
          setTimeout(() => navigate('/admin/login'), 2000);
        } else {
          setError(error.response?.data?.message || "Failed to fetch users. Please try again later.");
        }
      }
    };
    fetchUsers();
  }, [navigate]);

  // Ban/Unban user
  const handleBanUnban = async (id, isCurrentlyBanned) => {
    try {
      const endpoint = isCurrentlyBanned ? `/api/users/unban/${id}` : `/api/users/ban/${id}`;
      const response = await axios.put(endpoint);
      setUsers((prev) =>
        prev.map((user) =>
          user._id === id ? { ...user, ...response.data } : user
        )
      );
      setError(null);
    } catch (error) {
      console.error("Error banning/unbanning user:", error);
      setError(error.response?.data?.message || "Failed to update ban status. Please try again.");
    }
  };

  // Delete user
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(`/api/users/${id}`);
        setUsers((prev) => prev.filter((user) => user._id !== id));
        setError(null);
        if (response.data.message) {
          console.log(response.data.message);
        }
      } catch (error) {
        console.error("Error deleting user:", error);
        setError(error.response?.data?.message || "Failed to delete user. Please try again.");
      }
    }
  };

  // Placeholder for update functionality (can be implemented later)
  const handleUpdate = (id) => {
    console.log(`Update user ${id}`);
    // Example: navigate(`/admin/users/edit/${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 ml-0 md:ml-64 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Users</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-4">
              {users.length === 0 && !error ? (
                <p>No users available.</p>
              ) : (
                users.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between p-4 bg-blue-50 rounded-lg shadow-md"
                  >
                    <div>
                      <span className="text-lg font-medium">{user.username}</span>
                      <p className="text-sm text-gray-600">
                        Email: {user.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        Phone: {user.phoneNumber} | Country: {user.country}
                      </p>
                      <p className={`text-sm ${user.isBanned ? "text-red-500" : "text-green-500"}`}>
                        {user.isBanned ? "Banned 🚫" : "Active 🟢"}
                      </p>
                    </div>
                    <div className="space-x-2 flex items-center">
                      <button
                        onClick={() => handleUpdate(user._id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 text-sm"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleBanUnban(user._id, user.isBanned)}
                        className={`px-4 py-2 rounded-lg text-sm text-white ${
                          user.isBanned
                            ? "bg-gray-500 hover:bg-gray-600"
                            : "bg-orange-500 hover:bg-orange-600"
                        }`}
                      >
                        {user.isBanned ? "Unban" : "Ban"}
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;