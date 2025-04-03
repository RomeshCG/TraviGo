import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const chartData = {
    labels: [
      "01 Mar",
      "02 Mar",
      "03 Mar",
      "04 Mar",
      "05 Mar",
      "06 Mar",
      "07 Mar",
      "08 Mar",
      "09 Mar",
      "10 Mar",
      "11 Mar",
      "12 Mar",
    ],
    datasets: [
      {
        type: "bar",
        label: "Hotel Bookings",
        data: [400, 300, 500, 450, 600, 350, 400, 700, 500, 300, 400, 200],
        backgroundColor: "rgba(255, 99, 132, 06)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Vehicle Rentals",
        data: [30, 25, 40, 35, 45, 20, 30, 50, 40, 25, 35, 15],
        borderColor: "rgba(255, 159, 64, 1)",
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        fill: false,
        tension: 0.3,
        yAxisID: "y1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: "Hotel Bookings vs Vehicle Rentals (01 Mar - 12 Mar 2025)",
      },
    },
    scales: {
      y: {
        type: "linear",
        display: true,
        position: "left",
        title: {
          display: true,
          text: "Hotel Bookings",
        },
        beginAtZero: true,
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        title: {
          display: true,
          text: "Vehicle Rentals",
        },
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
      },
      x: {
        title: {
          display: true,
          text: "Date",
        },
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 p-6 bg-gray-100">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Reports Dashboard</h2>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-700">Hotel Bookings</h3>
                <p className="text-2xl font-bold text-gray-900">1,587</p>
                <p className="text-sm text-green-600">+11% From previous period</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-700">Vehicle Rentals</h3>
                <p className="text-2xl font-bold text-gray-900">258</p>
                <p className="text-sm text-green-600">+9% New rentals</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-700">Tour Guide Bookings</h3>
                <p className="text-2xl font-bold text-gray-900">2.3k</p>
                <p className="text-sm text-green-600">+17% From previous period</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
                <p className="text-2xl font-bold text-gray-900">11,587</p>
                <p className="text-sm text-green-600">+21% From previous period</p>
              </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-4 rounded-lg shadow-md">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;