const Reports = () => {
    const reports = [
      { id: 1, title: "Monthly Revenue", date: "2025-03-01", status: "Completed" },
      { id: 2, title: "User Activity", date: "2025-03-05", status: "In Progress" },
      { id: 3, title: "Booking Trends", date: "2025-03-10", status: "Completed" },
    ];
  
    const handleSeeMore = (id) => {
      console.log(`See more for report ${id}`);
    };
  
    const handleDelete = (id) => {
      console.log(`Delete report ${id}`);
    };
  
    return (
      <div className="flex-1 p-6 bg-gray-100">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">Reports</h2>
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex items-center justify-between p-4 bg-pink-50 rounded-lg shadow-md"
              >
                <div>
                  <span className="text-lg font-medium">{report.title}</span>
                  <p className="text-sm text-gray-600">
                    Date: {report.date} | Status: {report.status}
                  </p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleSeeMore(report.id)}
                    className="text-gray-600 hover:text-gray-800"
                  >
                    See More &gt;
                  </button>
                  <button
                    onClick={() => handleDelete(report.id)}
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
  
  export default Reports;