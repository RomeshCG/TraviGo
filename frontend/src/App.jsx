import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import VehicleProviderRegister from './pages/VehicleProviderRegister';
import ServiceProviderLogin from './pages/ServiceProviderLogin';
import Dashboard from './pages/hotel/Dashboard';
import VehicleProviderDashboard from './pages/vehicle/VehicleProviderDashboard';
import TourGuideDashboard from './pages/tourguide/TourGuideDashboard';
import TourGuideCreatePackage from './pages/tourguide/TourGuideCreatePackage';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import UserDashboard from './pages/user/UserDashboard';
import EditProfile from './pages/user/EditProfile';
import ExploreDestinations from './pages/user/ExploreDestinations';
import MyBooking from './pages/user/MyBooking';
import AccountSettings from './pages/user/AccountSettings';
import VehicleRental from './pages/user/VehicleRental';
import TourGuides from './pages/user/TourGuide';
import TourGuidess from './pages/TourGuides';
import TravelPackages from './pages/user/TravelPackages';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Login from './pages/Login';
import HotelProviderRegister from './pages/HotelProviderRegister';
import TourGuideRegister from './pages/TourGuideRegister';
import ProviderReg from './pages/ServiceProviderRegister';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminRegister from './pages/Admin/AdminRegister';
import AdminDashboard from './pages/admin/AdminDashboard';
import HotelListing from './pages/admin/HotelListing';
import Reports from './pages/admin/Reports';
import TourGuide from './pages/admin/TourGuide';
import UIManager from './pages/Admin/UIManage';
import Users from './pages/admin/Users';
import VehicleListing from './pages/admin/VehicleListing';
import HotelListingsService from './pages/HotelListingsService';
import TourGuidesService from './pages/TourGuidesService';
import VehicleListingsService from './pages/VehicleListingsService';
import TourGuideProfile from './pages/TourGuideProfile';
import HotelCollection from './pages/HotelCollection';
import HotelDetails from './pages/HotelDetails';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import VehiclesPage from './pages/VehiclesPage';
import VehicleDetailPage from './pages/VehicleDetailPage';
import VehicleRentPage from './pages/VehicleRentPage';
import TourGuideBookingForm from './pages/tourguide/TourGuideBookingForm';
import TourGuidePaymentPage from './pages/tourguide/TourGuidePaymentPage';
import TourGuideBookingConfirmation from './pages/tourguide/TourGuideBookingConfirmation';
import TourGuidePayments from './pages/Admin/TourGuidePayments';
import TourGuideReports from './pages/Admin/TourGuideReports';
import UserTopBar from './components/UserTopBar';
import TourGuideBookings from './pages/user/TourGuideBookings';
import ReviewManagement from './pages/Admin/ReviewManagement';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Protected Route Component for Users
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch('/api/bookings/verify-token', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                }
            } catch {
                setIsAuthenticated(false);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            }
        };
        if (token) verifyToken();
        else setIsAuthenticated(false);
    }, [token]);

    if (isAuthenticated === null) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/login" replace />;
    return children;
};

// Protected Route Component for Admins
const ProtectedAdminRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch('/api/verify-admin-token', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (response.ok) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('admin');
                    localStorage.removeItem('adminToken');
                }
            } catch {
                setIsAuthenticated(false);
                localStorage.removeItem('admin');
                localStorage.removeItem('adminToken');
            }
        };
        if (token) verifyToken();
        else setIsAuthenticated(false);
    }, [token]);

    if (isAuthenticated === null) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
    return children;
};

// Protected Route Component for Service Providers
const ProtectedProviderRoute = ({ children, allowedProviderType }) => {
    const token = localStorage.getItem('providerToken');
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const response = await fetch('/api/verify-provider-token', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await response.json();
                if (response.ok && (!allowedProviderType || data.provider.providerType === allowedProviderType)) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                    localStorage.removeItem('provider');
                    localStorage.removeItem('providerToken');
                }
            } catch {
                setIsAuthenticated(false);
                localStorage.removeItem('provider');
                localStorage.removeItem('providerToken');
            }
        };
        if (token) verifyToken();
        else setIsAuthenticated(false);
    }, [token, allowedProviderType]);

    if (isAuthenticated === null) return <div>Loading...</div>;
    if (!isAuthenticated) return <Navigate to="/service-provider/login" replace />;
    return children;
};

function AppContent() {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');

    useEffect(() => {
        console.log(`Current route: ${location.pathname}`);
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (token && user) {
            fetch('/api/bookings/verify-token', {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then(res => {
                    if (res.ok) {
                        setIsAuthenticated(true);
                        try {
                            const parsed = JSON.parse(user);
                            setUsername(parsed.username || parsed.name || parsed.email || '');
                        } catch {
                            setUsername('');
                        }
                    } else {
                        setIsAuthenticated(false);
                        setUsername('');
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                    }
                })
                .catch(() => {
                    setIsAuthenticated(false);
                    setUsername('');
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                });
        } else {
            setIsAuthenticated(false);
            setUsername('');
        }
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUsername('');
        window.location.href = '/login';
    };

    const publicRoutes = ['/login', '/signin', '/service-provider/login', '/admin/login'];
    const hideUserTopBar = publicRoutes.includes(location.pathname);

    return (
        <>
            {isAuthenticated && username && !hideUserTopBar && (
                <UserTopBar username={username} onLogout={handleLogout} />
            )}
            <Routes>
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/" element={<Home />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/login" element={<Login />} />
                <Route path="/services/hotel-listings" element={<HotelListingsService />} />
                <Route path="/services/tour-guides" element={<TourGuidesService />} />
                <Route path="/tour-guide/:providerId" element={<TourGuideProfile />} />
                <Route path="/services/vehicle-listings" element={<VehicleListingsService />} />
                <Route path="/hotels" element={<HotelCollection />} />
                <Route path="/hotels/:id" element={<HotelDetails />} />
                <Route
                    path="/hotels/booking/:id/:roomType"
                    element={
                        <ProtectedRoute>
                            <BookingPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/hotels/payment"
                    element={
                        <ProtectedRoute>
                            <Elements stripe={stripePromise}>
                                <PaymentPage />
                            </Elements>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/dashboard"
                    element={
                        <ProtectedRoute>
                            <UserDashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/explore"
                    element={
                        <ProtectedRoute>
                            <ExploreDestinations />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/my-booking"
                    element={
                        <ProtectedRoute>
                            <MyBooking />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/my-booking/tour-guides"
                    element={
                        <ProtectedRoute>
                            <TourGuideBookings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/edit-profile"
                    element={
                        <ProtectedRoute>
                            <EditProfile />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/account-settings"
                    element={
                        <ProtectedRoute>
                            <AccountSettings />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/vehicles"
                    element={
                        <ProtectedRoute>
                            <VehicleRental />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/guides"
                    element={
                        <ProtectedRoute>
                            <TourGuides />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/user/packages"
                    element={
                        <ProtectedRoute>
                            <TravelPackages />
                        </ProtectedRoute>
                    }
                />
                <Route path="/vehicles" element={<VehiclesPage />} />
                <Route path="/vehicles/:id" element={<VehicleDetailPage />} />
                <Route
                    path="/rent"
                    element={
                        <ProtectedRoute>
                            <VehicleRentPage />
                        </ProtectedRoute>
                    }
                />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route
                    path="/admin/dashboard"
                    element={
                        <ProtectedAdminRoute>
                            <AdminDashboard />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/hotel-listing"
                    element={
                        <ProtectedAdminRoute>
                            <HotelListing />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/reports"
                    element={
                        <ProtectedAdminRoute>
                            <Reports />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/tour-guides"
                    element={
                        <ProtectedAdminRoute>
                            <TourGuide />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/ui-manager"
                    element={
                        <ProtectedAdminRoute>
                            <UIManager />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/users"
                    element={
                        <ProtectedAdminRoute>
                            <Users />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/vehicle-listing"
                    element={
                        <ProtectedAdminRoute>
                            <VehicleListing />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/tour-guide-payments"
                    element={
                        <ProtectedAdminRoute>
                            <TourGuidePayments />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/tour-guide-reports"
                    element={
                        <ProtectedAdminRoute>
                            <TourGuideReports />
                        </ProtectedAdminRoute>
                    }
                />
                <Route
                    path="/admin/review-management"
                    element={
                        <ProtectedAdminRoute>
                            <ReviewManagement />
                        </ProtectedAdminRoute>
                    }
                />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/service-provider/register" element={<ProviderReg />} />
                <Route path="/service-provider/register/hotel" element={<HotelProviderRegister />} />
                <Route path="/service-provider/register/tour-guide" element={<TourGuideRegister />} />
                <Route path="/service-provider/register/vehicle" element={<VehicleProviderRegister />} />
                <Route path="/service-provider/login" element={<ServiceProviderLogin />} />
                <Route
                    path="/tour-guide/dashboard"
                    element={
                        <ProtectedProviderRoute allowedProviderType="TourGuide">
                            <TourGuideDashboard />
                        </ProtectedProviderRoute>
                    }
                />
                <Route
                    path="/tour-guide/create-package"
                    element={
                        <ProtectedProviderRoute allowedProviderType="TourGuide">
                            <TourGuideCreatePackage />
                        </ProtectedProviderRoute>
                    }
                />
                <Route
                    path="/pages/hotel/dashboard"
                    element={
                        <ProtectedProviderRoute allowedProviderType="HotelProvider">
                            <Dashboard />
                        </ProtectedProviderRoute>
                    }
                />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedProviderRoute allowedProviderType="HotelProvider">
                            <Dashboard />
                        </ProtectedProviderRoute>
                    }
                />
                <Route
                    path="/pages/vehicle/dashboard"
                    element={
                        <ProtectedProviderRoute allowedProviderType="VehicleProvider">
                            <VehicleProviderDashboard />
                        </ProtectedProviderRoute>
                    }
                />
                <Route path="/tour-guides" element={<TourGuidess />} />
                <Route
                    path="/book-tour-package/:guideId/:packageId"
                    element={
                        <ProtectedRoute>
                            <TourGuideBookingForm />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tour-guide/payment"
                    element={
                        <ProtectedRoute>
                            <TourGuidePaymentPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/tour-guide/confirmation"
                    element={
                        <ProtectedRoute>
                            <TourGuideBookingConfirmation />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <Router>
            <AppContent />
        </Router>
    );
}

export default App;