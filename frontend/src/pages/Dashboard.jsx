
function Dashboard() {
  // Sample user data (replace with API call later)
  const user = {
    username: "john_doe",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    country: "United States",
    createdAt: "2025-03-20",
    profilePicture: "https://via.placeholder.com/150",
    bookings: {
      hotels: [
        {
          id: 1,
          name: "Lake Avenue",
          checkIn: "2025-04-01",
          checkOut: "2025-04-05",
          status: "Confirmed",
          totalCost: 450,
        },
      ],
      cars: [
        {
          id: 1,
          model: "Toyota KDH",
          rentalStart: "2025-04-01",
          rentalEnd: "2025-04-05",
          status: "Confirmed",
          totalCost: 120,
        },
      ],
    },
    travelStats: [
      { month: "Jan", trips: 2 },
      { month: "Feb", trips: 1 },
      { month: "Mar", trips: 3 },
      { month: "Apr", trips: 2 },
      { month: "May", trips: 4 },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile and Quick Actions */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Welcome back, {user.username}
            </h2>
            <div className="flex items-center space-x-4">
              <img
                src={user.profilePicture}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">Email:</span> {user.email}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Phone:</span> {user.phoneNumber}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Country:</span> {user.country}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600">
                Book a Hotel
              </button>
              <button className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600">
                Rent a Car
              </button>
              <button className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600">
                Plan a Tour
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Travel Stats and Upcoming Trips */}
        <div className="lg:col-span-2 space-y-6">
          {/* Travel Statistics Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Travel Statistics
              </h2>
              <select className="border rounded-lg px-2 py-1 text-gray-600">
                <option>Week</option>
                <option>Month</option>
                <option>Year</option>
              </select>
            </div>
            {/* Placeholder for Chart (you can use a library like Chart.js later) */}
            <div className="h-48 flex items-end space-x-4">
              {user.travelStats.map((stat, index) => (
                <div key={index} className="flex-1 text-center">
                  <div
                    className="bg-blue-500 rounded-t-lg"
                    style={{ height: `${stat.trips * 30}px` }}
                  ></div>
                  <p className="text-gray-600 mt-2">{stat.month}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Trips Card */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Upcoming Trips
              </h2>
              <a href="#" className="text-blue-500 hover:underline">
                View All
              </a>
            </div>
            {/* Hotel Bookings */}
            <div className="space-y-4">
              {user.bookings.hotels.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{booking.name}</p>
                    <p className="text-gray-600">
                      {booking.checkIn} - {booking.checkOut}
                    </p>
                    <p className="text-gray-600">
                      Status: <span className="text-green-500">{booking.status}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-semibold">${booking.totalCost}</p>
                    <button className="text-blue-500 hover:underline">
                      Details
                    </button>
                  </div>
                </div>
              ))}
              {/* Car Rentals */}
              {user.bookings.cars.map((car) => (
                <div
                  key={car.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{car.model}</p>
                    <p className="text-gray-600">
                      {car.rentalStart} - {car.rentalEnd}
                    </p>
                    <p className="text-gray-600">
                      Status: <span className="text-green-500">{car.status}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-800 font-semibold">${car.totalCost}</p>
                    <button className="text-blue-500 hover:underline">
                      Details
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
}

export default Dashboard;