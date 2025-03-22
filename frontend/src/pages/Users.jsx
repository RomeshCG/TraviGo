const Users = () => {
    const users = [
      { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin" },
      { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "User" },
      { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com", role: "User" },
    ];
  
    const handleSeeMore = (id) => {
      console.log(`See more for user ${id}`);
    };
  
    const handleDelete = (id) => {
      console.log(`Delete user ${id}`);
    };
  
    return (
      <div className="flex-1 p-6 bg-gray-100">
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
                  <p className="text-sm text-gray-600">
                    Email: {user.email} | Role: {user.role}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleSeeMore(user.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    See More &gt;
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
    );
  };
  
  export default Users;