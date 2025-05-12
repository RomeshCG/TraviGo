import React from 'react';

const DashboardHome = () => {
    return (
        <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded shadow p-6 flex flex-col items-start">
                    <span className="text-gray-400 mb-2">Total views</span>
                    <span className="text-2xl font-bold">$3.456K</span>
                    <span className="text-green-500 text-sm mt-1">0.43% ↑</span>
                </div>
                <div className="bg-white rounded shadow p-6 flex flex-col items-start">
                    <span className="text-gray-400 mb-2">Total Profit</span>
                    <span className="text-2xl font-bold">$45,2K</span>
                    <span className="text-green-500 text-sm mt-1">4.35% ↑</span>
                </div>
                <div className="bg-white rounded shadow p-6 flex flex-col items-start">
                    <span className="text-gray-400 mb-2">Total Product</span>
                    <span className="text-2xl font-bold">2.450</span>
                    <span className="text-green-500 text-sm mt-1">2.59% ↑</span>
                </div>
                <div className="bg-white rounded shadow p-6 flex flex-col items-start">
                    <span className="text-gray-400 mb-2">Total Users</span>
                    <span className="text-2xl font-bold">3.456</span>
                    <span className="text-blue-500 text-sm mt-1">0.95% ↓</span>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-white rounded shadow p-6 col-span-2">
                    <h3 className="font-semibold mb-2">Total Revenue</h3>
                    <div className="h-48 flex items-center justify-center text-gray-400">[Chart Placeholder]</div>
                </div>
                <div className="bg-white rounded shadow p-6">
                    <h3 className="font-semibold mb-2">Profit this week</h3>
                    <div className="h-48 flex items-center justify-center text-gray-400">[Bar Chart Placeholder]</div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome; 