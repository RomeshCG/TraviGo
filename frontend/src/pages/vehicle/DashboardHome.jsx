import React, { useEffect, useState } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import 'chart.js/auto';

const DashboardHome = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError('');
            try {
                const provider = JSON.parse(localStorage.getItem('provider'));
                const providerId = provider?._id;
                // Fetch all orders for this provider's vehicles
                const res = await fetch(`http://localhost:5000/api/orders`);
                const allOrders = await res.json();
                // Fetch all vehicles for this provider
                const vehiclesRes = await fetch(`http://localhost:5000/api/renting-vehicles`);
                const vehiclesData = await vehiclesRes.json();
                // Filter vehicles owned by this provider
                const myVehicles = vehiclesData.vehicles.filter(v => v.providerId === providerId);
                // Filter orders for this provider's vehicles
                const myOrders = allOrders.filter(o => myVehicles.some(v => v._id === o.vehicleId?._id));
                // Calculate stats
                const totalRevenue = myOrders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
                const totalProfit = totalRevenue * 0.8; // Example: 80% profit margin
                const totalVehicles = myVehicles.length;
                const totalCustomers = new Set(myOrders.map(o => o.userId)).size;
                // Chart data: revenue by month
                const monthlyRevenue = Array(12).fill(0);
                myOrders.forEach(o => {
                    const d = new Date(o.startDate);
                    const month = d.getMonth();
                    monthlyRevenue[month] += o.totalPrice || 0;
                });
                setStats({
                    totalRevenue,
                    totalProfit,
                    totalProduct: totalVehicles,
                    totalUsers: totalCustomers,
                    monthlyRevenue,
                    myOrders,
                });
            } catch {
                setError('Failed to fetch dashboard data');
            }
            setLoading(false);
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8">Loading dashboard...</div>;
    if (error) return <div className="p-8 text-red-600">{error}</div>;
    if (!stats) return null;

    return (
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded shadow p-6 flex flex-col items-start">
                    <span className="text-gray-400 mb-2">Total Revenue</span>
                    <span className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</span>
                </div>
                <div className="bg-white rounded shadow p-6 flex flex-col items-start">
                    <span className="text-gray-400 mb-2">Total Profit</span>
                    <span className="text-2xl font-bold">${stats.totalProfit.toLocaleString()}</span>
                </div>
                <div className="bg-white rounded shadow p-6 flex flex-col items-start">
                    <span className="text-gray-400 mb-2">Total Vehicles</span>
                    <span className="text-2xl font-bold">{stats.totalProduct}</span>
                </div>
                <div className="bg-white rounded shadow p-6 flex flex-col items-start">
                    <span className="text-gray-400 mb-2">Total Customers</span>
                    <span className="text-2xl font-bold">{stats.totalUsers}</span>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded shadow p-6 col-span-2">
                    <h3 className="font-semibold mb-2">Monthly Revenue</h3>
                    <Line
                        data={{
                            labels: [
                                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
                            ],
                            datasets: [
                                {
                                    label: 'Revenue',
                                    data: stats.monthlyRevenue,
                                    backgroundColor: 'rgba(37, 99, 235, 0.2)',
                                    borderColor: '#2563eb',
                                    borderWidth: 2,
                                    fill: true,
                                    tension: 0.4,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: { legend: { display: false } },
                        }}
                        height={180}
                    />
                </div>
                <div className="bg-white rounded shadow p-6">
                    <h3 className="font-semibold mb-2">Booking Status</h3>
                    <Doughnut
                        data={{
                            labels: ['Confirmed', 'Cancelled', 'Pending'],
                            datasets: [
                                {
                                    data: [
                                        stats.myOrders.filter(o => o.status === 'Confirmed').length,
                                        stats.myOrders.filter(o => o.status === 'Cancelled').length,
                                        stats.myOrders.filter(o => o.status === 'Pending').length,
                                    ],
                                    backgroundColor: [
                                        '#22c55e', '#ef4444', '#fbbf24'
                                    ],
                                    borderWidth: 1,
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            plugins: { legend: { position: 'bottom' } },
                        }}
                        height={180}
                    />
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;