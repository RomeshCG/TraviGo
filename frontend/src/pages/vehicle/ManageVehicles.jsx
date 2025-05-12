import React from 'react';

const ManageVehicles = () => {
    return (
        <div className="p-8">
            <h2 className="text-2xl font-bold mb-4">Manage Vehicles</h2>
            <div className="bg-white rounded shadow p-6">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-left py-2">Vehicle Name</th>
                            <th className="text-left py-2">Type</th>
                            <th className="text-left py-2">Status</th>
                            <th className="text-left py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Honda Civic</td>
                            <td>Sedan</td>
                            <td>Active</td>
                            <td><button className="text-blue-600">Edit</button></td>
                        </tr>
                        <tr>
                            <td>Toyota Hiace</td>
                            <td>Van</td>
                            <td>Inactive</td>
                            <td><button className="text-blue-600">Edit</button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageVehicles; 