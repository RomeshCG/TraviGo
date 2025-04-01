import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import VehicleProviderRegister from './pages/VehicleProviderRegister';
import ServiceProviderLogin from './pages/ServiceProviderLogin';
import HotelProviderDashboard from './pages/hotel/HotelProviderDashboard';
import VehicleProviderDashboard from './pages/vehicle/VehicleProviderDashboard';
import TourGuideDashboard from './pages/tourguide/TourGuideDashboard';
import TourGuideCreatePackage from './pages/tourguide/TourGuideCreatePackage'; // Add this import
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import UserDashboard from './pages/user/UserDashboard';
import EditProfile from './pages/user/EditProfile';
import ExploreDestinations from './pages/user/ExploreDestinations';
import MyBooking from './pages/user/MyBooking';
import AccountSettings from './pages/user/AccountSettings';
import HotelBooking from './pages/user/HotelBooking';
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

// Protected Route Component for Users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/verify-token', {
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

// Protected Route Component for Service Providers (Tour Guides)
const ProtectedProviderRoute = ({ children }) => {
  const token = localStorage.getItem('providerToken');
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch('/api/verify-provider-token', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
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
  }, [token]);

  if (isAuthenticated === null) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/service-provider/login" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/admin/register" element={<AdminRegister />} />
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
        <Route path="/services/hotel-listings" element={<HotelListingsService />} />
        <Route path="/services/tour-guides" element={<TourGuidesService />} />
        <Route path="/tour-guide/:providerId" element={<TourGuideProfile />} />
        <Route path="/services/vehicle-listings" element={<VehicleListingsService />} />
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
          path="/user/hotels"
          element={
            <ProtectedRoute>
              <HotelBooking />
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
        {/* Admin Routes */}
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
            <ProtectedProviderRoute>
              <TourGuideDashboard />
            </ProtectedProviderRoute>
          }
        />
        <Route
          path="/tour-guide/create-package" // New route
          element={
            <ProtectedProviderRoute>
              <TourGuideCreatePackage />
            </ProtectedProviderRoute>
          }
        />
        <Route path="/pages/hotel/dashboard" element={<HotelProviderDashboard />} />
        <Route path="/pages/vehicle/dashboard" element={<VehicleProviderDashboard />} />
        <Route path="/tour-guides" element={<TourGuidess />} />
      </Routes>
    </Router>
  );
}

export default App;