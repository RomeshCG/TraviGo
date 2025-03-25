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




function App(){
  return (
    
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
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