import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";

const VehicleListing = () => {
  const vehicles = [
    { id: 1, type: "Sedan", model: "Toyota Camry", year: 2020 },
    { id: 2, type: "SUV", model: "Honda CR-V", year: 2021 },
    { id: 3, type: "Van", model: "Ford Transit", year: 2019 },
  ];

  const handleUpdate = (id) => {
    console.log(`Update vehicle ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete vehicle ${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Vehicle Listing</h2>
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
                      onClick={() => handleUpdate(vehicle.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      Update
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
      </div>
    </div>
  );
};

export default VehicleListing;