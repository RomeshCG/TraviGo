import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import SimpleHeader from '../../components/SimpleHeader';
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <SimpleHeader />
            <div className="flex flex-1 min-h-[80vh] bg-gray-100">
                {/* Sidebar */}
                <aside className="w-64 bg-gradient-to-b from-blue-900 to-blue-700 text-white flex flex-col py-8 px-4 min-h-[80vh]">
                    <div className="mb-8">
                        <div className="text-2xl font-bold mb-2">TraviGo</div>
                        <div className="text-sm text-blue-200">Vehicle Provider</div>
                    </div>
                    <nav className="flex-1">
                        <ul className="space-y-2">
                            {sidebarLinks.map(link => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className={`block px-4 py-2 rounded transition font-medium ${location.pathname === link.path ? 'bg-blue-600 text-white' : 'hover:bg-blue-800 hover:text-white text-blue-100'}`}
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <button
                        onClick={confirmLogout}
                        className="mt-8 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 text-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </aside>
                {/* Main Content */}
                <main className="flex-1 min-h-[80vh]">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-900">{sidebarLinks.find(l => l.path === location.pathname)?.name || 'Dashboard'}</h1>
                            <span className="text-gray-600">Welcome, {providerData?.name}</span>
                        </div>
                        <Outlet />
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