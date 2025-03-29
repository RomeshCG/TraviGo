import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react'; // Add useState and useEffect
import VehicleProviderRegister from './pages/VehicleProviderRegister';
import ServiceProviderLogin from './pages/ServiceProviderLogin';
import HotelProviderDashboard from './pages/hotel/HotelProviderDashboard';
import VehicleProviderDashboard from './pages/vehicle/VehicleProviderDashboard';
import TourGuideDashboard from './pages/tourguide/TourGuideDashboard';
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
import TravelPackages from './pages/user/TravelPackages';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import Login from './pages/Login';
import HotelProviderRegister from './pages/HotelProviderRegister';
import TourGuideRegister from './pages/TourGuideRegister';


// Protected Route Component
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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/login" element={<Login />} />
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
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/service-provider/register/hotel" element={<HotelProviderRegister />} />
        <Route path="/service-provider/register/tour-guide" element={<TourGuideRegister />} />
        <Route path="/service-provider/register/vehicle" element={<VehicleProviderRegister />} />
        <Route path="/service-provider/login" element={<ServiceProviderLogin />} />
        <Route path="/tour-guide/dashboard" element={<TourGuideDashboard />} />
        <Route path="/pages/hotel/dashboard" element={<HotelProviderDashboard />} />
        <Route path="/pages/vehicle/dashboard" element={<VehicleProviderDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;