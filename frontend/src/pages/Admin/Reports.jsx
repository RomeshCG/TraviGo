import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
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
  ArcElement,
} from "chart.js";
import AdminSidebar from "../../components/SidebarAdmin";
import AdminHeader from "../../components/AdminHeader";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("/api/admin/reports/summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch reports");
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const exportSystemReport = () => {
    if (!summary) return;
    const data = [
      {
        "System Income": summary.systemIncome,
        "Total Users": summary.totalUsers,
        "Hotel Bookings": summary.totalHotelBookings,
        "Tour Bookings": summary.totalTourBookings,
        "Vehicle Bookings": summary.totalVehicleBookings,
        "Hotel Income": summary.hotelIncome,
        "Tour Income": summary.tourIncome,
        "Vehicle Income": summary.vehicleIncome,
      },
    ];
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "System Report");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "System_Report.xlsx");
  };

  const exportHotelReport = () => {
    if (!summary) return;
    const data = summary.dailyIncome.map((d) => ({
      Date: d.date,
      "Hotel Income": d.hotel,
      "Hotel Bookings": summary.totalHotelBookings,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Hotel Report");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Hotel_Report.xlsx");
  };

  const exportTourReport = () => {
    if (!summary) return;
    const data = summary.dailyIncome.map((d) => ({
      Date: d.date,
      "Tour Income": d.tour,
      "Tour Bookings": summary.totalTourBookings,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tour Report");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Tour_Report.xlsx");
  };

  const exportVehicleReport = () => {
    if (!summary) return;
    const data = summary.dailyIncome.map((d) => ({
      Date: d.date,
      "Vehicle Income": d.vehicle,
      "Vehicle Bookings": summary.totalVehicleBookings,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Vehicle Report");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "Vehicle_Report.xlsx");
  };

  const exportUserReport = () => {
    if (!summary) return;
    const data = summary.dailyUsers.map((d) => ({
      Date: d.date,
      "New Users": d.count,
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User Report");
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), "User_Report.xlsx");
  };

  // Chart data
  const incomeChartData = summary && {
    labels: summary.dailyIncome.map((d) => d.date),
    datasets: [
      {
        type: "bar",
        label: "Hotel Income",
        data: summary.dailyIncome.map((d) => d.hotel),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
        yAxisID: "y",
      },
      {
        type: "bar",
        label: "Tour Income",
        data: summary.dailyIncome.map((d) => d.tour),
        backgroundColor: "rgba(255, 206, 86, 0.7)",
        yAxisID: "y",
      },
      {
        type: "bar",
        label: "Vehicle Income",
        data: summary.dailyIncome.map((d) => d.vehicle),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
        yAxisID: "y",
      },
      {
        type: "line",
        label: "Total Income",
        data: summary.dailyIncome.map((d) => d.total),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
        tension: 0.3,
        yAxisID: "y",
      },
    ],
  };

  const userChartData = summary && {
    labels: summary.dailyUsers.map((d) => d.date),
    datasets: [
      {
        type: "line",
        label: "New Users",
        data: summary.dailyUsers.map((d) => d.count),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const bookingPieData = summary && {
    labels: ["Hotel Bookings", "Tour Bookings", "Vehicle Bookings"],
    datasets: [
      {
        data: [
          summary.totalHotelBookings,
          summary.totalTourBookings,
          summary.totalVehicleBookings,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ],
      },
    ],
  };

  const incomePieData = summary && {
    labels: ["Hotel Income", "Tour Income", "Vehicle Income"],
    datasets: [
      {
        data: [summary.hotelIncome, summary.tourIncome, summary.vehicleIncome],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "bottom" },
      title: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
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
            <div className="flex flex-wrap gap-3 mb-6">
              <button onClick={exportSystemReport} className="bg-gradient-to-r from-blue-700 to-blue-500 text-white px-4 py-2 rounded-lg shadow hover:from-blue-800 hover:to-blue-600 font-semibold border border-blue-800">Export System Report</button>
              <button onClick={exportHotelReport} className="bg-gradient-to-r from-gray-700 to-gray-500 text-white px-4 py-2 rounded-lg shadow hover:from-gray-800 hover:to-gray-600 font-semibold border border-gray-700">Export Hotel Report</button>
              <button onClick={exportTourReport} className="bg-gradient-to-r from-slate-700 to-slate-500 text-white px-4 py-2 rounded-lg shadow hover:from-slate-800 hover:to-slate-600 font-semibold border border-slate-700">Export Tour Report</button>
              <button onClick={exportVehicleReport} className="bg-gradient-to-r from-neutral-700 to-neutral-500 text-white px-4 py-2 rounded-lg shadow hover:from-neutral-800 hover:to-neutral-600 font-semibold border border-neutral-700">Export Vehicle Report</button>
              <button onClick={exportUserReport} className="bg-gradient-to-r from-indigo-700 to-indigo-500 text-white px-4 py-2 rounded-lg shadow hover:from-indigo-800 hover:to-indigo-600 font-semibold border border-indigo-700">Export User Report</button>
            </div>
            {loading ? (
              <div className="text-center py-10">Loading reports...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : summary ? (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">System Income</h3>
                    <p className="text-2xl font-bold text-gray-900">${summary.systemIncome.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">Total Users</h3>
                    <p className="text-2xl font-bold text-gray-900">{summary.totalUsers.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">Hotel Bookings</h3>
                    <p className="text-2xl font-bold text-gray-900">{summary.totalHotelBookings.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">Tour Bookings</h3>
                    <p className="text-2xl font-bold text-gray-900">{summary.totalTourBookings.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">Vehicle Bookings</h3>
                    <p className="text-2xl font-bold text-gray-900">{summary.totalVehicleBookings.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">Hotel Income</h3>
                    <p className="text-2xl font-bold text-gray-900">${summary.hotelIncome.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">Tour Income</h3>
                    <p className="text-2xl font-bold text-gray-900">${summary.tourIncome.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-medium text-gray-700">Vehicle Income</h3>
                    <p className="text-2xl font-bold text-gray-900">${summary.vehicleIncome.toLocaleString()}</p>
                  </div>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">System Income (Last 14 Days)</h3>
                    <Bar data={incomeChartData} options={chartOptions} height={260} />
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-2">User Registrations (Last 14 Days)</h3>
                    <Line data={userChartData} options={chartOptions} height={260} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">Booking Breakdown</h3>
                    <div style={{ maxWidth: 260 }}>
                      <Pie data={bookingPieData} />
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">Income Breakdown</h3>
                    <div style={{ maxWidth: 260 }}>
                      <Pie data={incomePieData} />
                    </div>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;