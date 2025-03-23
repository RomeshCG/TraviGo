function Header() {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-gray-800">TouristApp</h1>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">Welcome, John Doe</span>
        <button className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600">
          Sign Out
        </button>
      </div>
    </header>
  );
}

export default Header;