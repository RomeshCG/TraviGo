const UIManage = () => {
    const uiElements = [
      { id: 1, name: "Homepage Banner", status: "Active" },
      { id: 2, name: "Footer Links", status: "Inactive" },
      { id: 3, name: "Navigation Menu", status: "Active" },
    ];
  
    const handleSeeMore = (id) => {
      console.log(`See more for UI element ${id}`);
    };
  
    const handleDelete = (id) => {
      console.log(`Delete UI element ${id}`);
    };
  
    return (
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">UI Manage</h2>
          <div className="space-y-4">
            {uiElements.map((element) => (
              <div
                key={element.id}
                className="flex items-center justify-between p-4 bg-pink-50 rounded-lg shadow-md"
              >
                <div>
                  <span className="text-lg font-medium">{element.name}</span>
                  <p className="text-sm text-gray-600">Status: {element.status}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleSeeMore(element.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    See More &gt;
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
    );
  };
  
  export default UIManage;