function PreviousBookings() {
  const previousBookings = [
    { id: 1, name: "Alice Johnson", date: "2025-03-25", roomType: "Standard Room", totalPrice: 200 },
    { id: 2, name: "Bob Wilson", date: "2025-03-26", roomType: "Deluxe Room", totalPrice: 500 },
  ];

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">Previous Bookings</h2>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold">Name</th>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold">Date</th>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold">Room Type</th>
              <th className="px-6 py-3 text-left text-gray-700 font-semibold">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {previousBookings.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td className="px-6 py-4 text-gray-700">{booking.name}</td>
                <td className="px-6 py-4 text-gray-700">{booking.date}</td>
                <td className="px-6 py-4 text-gray-700">{booking.roomType}</td>
                <td className="px-6 py-4 text-gray-700">${booking.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PreviousBookings;