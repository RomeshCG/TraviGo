const Home = ({ provider }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-gray-800">Welcome, {provider.name}!</h2>
      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
        <p className="mb-2"><strong>Email:</strong> {provider.email}</p>
        <p className="mb-2"><strong>Provider Type:</strong> {provider.providerType}</p>
      </div>
      <p className="text-gray-600">
        Manage your vehicle rentals, bookings, and reports from the sidebar.
      </p>
    </div>
  );
};

export default Home;