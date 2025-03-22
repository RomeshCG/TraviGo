const VehicleListings = () => {
    const vehicles = [
      { id: 1, type: "Sedan", model: "Toyota Camry", year: 2020 },
      { id: 2, type: "SUV", model: "Honda CR-V", year: 2021 },
      { id: 3, type: "Van", model: "Ford Transit", year: 2019 },
    ];
  
    const handleSeeMore = (id) => {
      console.log(`See more for vehicle ${id}`);
    };
  
    const handleDelete = (id) => {
      console.log(`Delete vehicle ${id}`);
    };
  
    return (
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Vehicle Listings</h2>
          <div className="space-y-4">
            {vehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="flex items-center justify-between p-4 bg-pink-50 rounded-lg shadow-md"
              >
                <div>
                  <span className="text-lg font-medium">{vehicle.model}</span>
                  <p className="text-sm text-gray-600">
                    Type: {vehicle.type} | Year: {vehicle.year}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleSeeMore(vehicle.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    See More &gt;
                  </button>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
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
  
  export default VehicleListings;