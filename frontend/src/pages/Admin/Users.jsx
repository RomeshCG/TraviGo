import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";

const Users = () => {
  const users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 3, name: "Mike Johnson", email: "mike.johnson@example.com" },
  ];

  const handleUpdate = (id) => {
    console.log(`Update user ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete user ${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 ml-0 md:ml-64 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Users</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-pink-50 rounded-lg shadow-md"
                >
                  <div>
                    <span className="text-lg font-medium">{user.name}</span>
                    <p className="text-sm text-gray-600">Email: {user.email}</p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleUpdate(user.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Users;