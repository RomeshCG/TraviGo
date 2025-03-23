import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Dashboard from "./pages/Dashboard";
import AboutUs from "./pages/AboutUs";
import HotelBooking from "./pages/HotelBooking";
import VehicleRental from "./pages/VehicleRental";
import TourGuides from "./pages/TourGuides";
import TravelPackages from "./pages/TravelPackages";
import ExploreDestinations from "./pages/ExploreDestinations";
import MyBooking from "./pages/MyBooking";
import EditProfile from "./pages/EditProfile";
import AccountSettings from "./pages/AccountSettings";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <Sidebar />
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/hotels" element={<HotelBooking />} />
            <Route path="/vehicles" element={<VehicleRental />} />
            <Route path="/guides" element={<TourGuides />} />
            <Route path="/packages" element={<TravelPackages />} />
            <Route path="/explore" element={<ExploreDestinations />} />
            <Route path="/my-booking" element={<MyBooking />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/account-settings" element={<AccountSettings />} />
            <Route path="/sign-out" element={<div className="p-6">Sign Out Page (Placeholder)</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;