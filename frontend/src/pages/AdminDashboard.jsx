const AdminDashboard = () => {
    // Sample data for the list (you can replace this with data from an API)
    const listings = [
      { id: 1, name: "The Grand Horizon" },
      { id: 2, name: "Queens Hotel" },
      { id: 3, name: "Grand Kandyan" },
    ];
  
    const handleSeeMore = (id) => {
      console.log(`See more for listing ${id}`);
      // Add logic to navigate to a details page or show more details
    };
  
    const handleDelete = (id) => {
      console.log(`Delete listing ${id}`);
      // Add logic to delete the listing (e.g., API call)
    };
  
    return (
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Hotel Listings</h2>
          <div className="space-y-4">
            {listings.map((listing) => (
              <div
                key={listing.id}
                className="flex items-center justify-between p-4 bg-pink-50 rounded-lg shadow-md"
              >
                <span className="text-lg font-medium">{listing.name}</span>
                <div className="space-x-2">
                  <button
                    onClick={() => handleSeeMore(listing.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    See More &gt;
                  </button>
                  <button
                    onClick={() => handleDelete(listing.id)}
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
  
  export default AdminDashboard;