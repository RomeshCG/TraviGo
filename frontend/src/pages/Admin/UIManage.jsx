import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";

const UIManager = () => {
  const uiElements = [
    { id: 1, name: "Dark Theme", description: "A dark mode theme for the app" },
    { id: 2, name: "Light Theme", description: "A light mode theme for the app" },
    { id: 3, name: "Holiday Banner", description: "A festive banner for the homepage" },
  ];

  const handleEdit = (id) => {
    console.log(`Edit UI element ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete UI element ${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">UI Manager</h2>
            <div className="space-y-4">
              {uiElements.map((element) => (
                <div
                  key={element.id}
                  className="flex items-center justify-between p-4 bg-pink-50 rounded-lg shadow-md"
                >
                  <div>
                    <span className="text-lg font-medium">{element.name}</span>
                    <p className="text-sm text-gray-600">
                      Description: {element.description}
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={() => handleEdit(element.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(element.id)}
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

export default UIManager;