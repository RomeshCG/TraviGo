import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import Footer from '../../components/Footer';

const sidebarLinks = [
    { name: 'Dashboard', path: '/vehicle/dashboard' },
    { name: 'Add Vehicle', path: '/vehicle/add' },
    { name: 'Manage Vehicles', path: '/vehicle/manage' },
    { name: 'Bookings', path: '/vehicle/bookings' },
];

const VehicleAdminDashboard = () => {
    const [providerData, setProviderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        profilePic: null,
    });
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAndLoadProvider = async () => {
            const token = localStorage.getItem('providerToken');
            const provider = localStorage.getItem('provider');

            if (!token || !provider) {
                navigate('/service-provider/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/verify-provider-token', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();

                if (response.ok && data.provider && data.provider.providerType === 'VehicleProvider') {
                    setProviderData(data.provider);
                    setFormData({
                        name: data.provider.name || '',
                        email: data.provider.email || '',
                        phone: data.provider.phone || '',
                        address: data.provider.address || '',
                        profilePic: null,
                    });
                } else {
                    handleLogout();
                }
            } catch (error) {
                console.error('Error verifying provider:', error);
                handleLogout();
            } finally {
                setLoading(false);
            }
        };

        verifyAndLoadProvider();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('providerToken');
        localStorage.removeItem('provider');
        navigate('/service-provider/login');
    };

    const confirmLogout = () => setShowLogoutConfirm(true);
    const cancelLogout = () => setShowLogoutConfirm(false);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePic: e.target.files[0] });
    };

    const handleSaveChanges = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('providerToken');
        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('phone', formData.phone);
        formDataToSend.append('address', formData.address);
        if (formData.profilePic) {
            formDataToSend.append('profilePic', formData.profilePic);
        }

        try {
            const response = await fetch('http://localhost:5000/api/provider/update-profile', {
                method: 'PUT',
                headers: { Authorization: `Bearer ${token}` },
                body: formDataToSend,
            });
            const data = await response.json();

            if (response.ok) {
                setProviderData(data.provider);
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert(data.message || 'Failed to update profile');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('An error occurred while updating the profile.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <div className="flex flex-1 min-h-[80vh] bg-gray-100">
                {/* Sidebar */}
                <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col py-8 px-4 min-h-[80vh]">
                    {/* Profile Section */}
                    <div className="mb-8 text-center">
                        <img
                            src={
                                providerData?.profilePic ||
                                'https://via.placeholder.com/100'
                            }
                            alt="Profile"
                            className="w-24 h-24 rounded-full mx-auto mb-4"
                        />
                        <h2 className="text-xl font-bold">{providerData?.name || 'Admin'}</h2>
                        <p className="text-sm text-blue-200">{providerData?.email}</p>
                        <p className="text-sm text-blue-200">{providerData?.phone || 'N/A'}</p>
                        <p className="text-sm text-blue-200">{providerData?.address || 'N/A'}</p>
                        <button
                            onClick={handleEditToggle}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    {/* Sidebar Links */}
                    <nav className="flex-1">
                        <ul className="space-y-2">
                            {sidebarLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`block px-4 py-2 rounded transition font-medium ${
                                            location.pathname === link.path
                                                ? 'bg-blue-600 text-white'
                                                : 'hover:bg-blue-800 hover:text-white text-blue-100'
                                        }`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    {/* Logout Button */}
                    <button
                        onClick={confirmLogout}
                        className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 text-lg"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Logout</span>
                    </button>
                </aside>

                {/* Main Content */}
                <main className="flex-1 min-h-[80vh]">
                    <div className="p-6">
                        {isEditing ? (
                            <form onSubmit={handleSaveChanges} className="space-y-4">
                                <div>
                                    <label className="block font-medium">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Phone</label>
                                    <input
                                        type="text"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className="w-full border rounded px-3 py-2"
                                    />
                                </div>
                                <div>
                                    <label className="block font-medium">Profile Picture</label>
                                    <input
                                        type="file"
                                        name="profilePic"
                                        onChange={handleFileChange}
                                        className="w-full"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    Save Changes
                                </button>
                            </form>
                        ) : (
                            <Outlet />
                        )}
                    </div>
                </main>
            </div>

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
                        <h3 className="text-lg font-semibold mb-4">Confirm Logout</h3>
                        <p className="text-gray-600 mb-6">Are you sure you want to logout from your account?</p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={cancelLogout}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

export default VehicleAdminDashboard;