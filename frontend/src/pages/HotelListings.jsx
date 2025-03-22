const HotelListings = () => {
    const hotels = [
      { id: 1, name: "The Grand Horizon", location: "New York", rating: 4.5 },
      { id: 2, name: "Ocean Breeze Resort", location: "Miami", rating: 4.2 },
      { id: 3, name: "Mountain View Lodge", location: "Colorado", rating: 4.8 },
    ];
  
    const handleSeeMore = (id) => {
      console.log(`See more for hotel ${id}`);
    };
  
    const handleDelete = (id) => {
      console.log(`Delete hotel ${id}`);
    };
  
    return (
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Hotel Listings</h2>
          <div className="space-y-4">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="flex items-center justify-between p-4 bg-pink-50 rounded-lg shadow-md"
              >
                <div>
                  <span className="text-lg font-medium">{hotel.name}</span>
                  <p className="text-sm text-gray-600">
                    Location: {hotel.location} | Rating: {hotel.rating}/5
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleSeeMore(hotel.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    See More &gt;
                  </button>
                  <button
                    onClick={() => handleDelete(hotel.id)}
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
  
  export default HotelListings;