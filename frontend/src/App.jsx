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

      </Routes>
    </Router>
  )
}
export default App;