import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"; 
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ServiceProviderRegister from './pages/ServiceProviderRegister';
import HotelProviderRegister from './pages/HotelProviderRegister';
import TourGuideRegister from './pages/TourGuideRegister';
import VehicleProviderRegister from './pages/VehicleProviderRegister';
import ServiceProviderLogin from './pages/ServiceProviderLogin';
import HotelProviderDashboard from './pages/hotel/HotelProviderDashboard';
import VehicleProviderDashboard from './pages/vehicle/VehicleProviderDashboard';
import TourGuideDashboard from "./pages/tourguide/TourGuideDashboard";
import AboutUs from "./pages/Aboutus"
import ContactUs from "./pages/ContactUs";
import UserDashboard from './pages/user/UserDashboard';
import EditProfile from './pages/user/EditProfile';


const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user');
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App(){
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
        
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/contact" element={<ContactUs/>} />
      <Route path="/service-provider/register" element={<ServiceProviderRegister />} />
      <Route path="/service-provider/register/hotel" element={<HotelProviderRegister />} />
      <Route path="/service-provider/register/tour-guide" element={<TourGuideRegister />} />
      <Route path="/service-provider/register/vehicle" element={<VehicleProviderRegister />} />
      <Route path="/service-provider/login" element={<ServiceProviderLogin />} />
      <Route path="/tour-guide/dashboard" element={<TourGuideDashboard />} />
      <Route path="/pages/hotel/dashboard" element={<HotelProviderDashboard />} />
      <Route path="/pages/vehicle/dashboard" element={<VehicleProviderDashboard />
    } />
      </Routes>
    </Router>
  )
}
export default App;