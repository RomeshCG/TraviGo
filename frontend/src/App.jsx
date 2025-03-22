import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
import HotelListings from "./pages/HotelListings";
import VehicleListings from "./pages/VehicleListings";
import Users from "./pages/Users";
import Reports from "./pages/Reports";
import UIManage from "./pages/UIManage";
import ContactUs from "./pages/ContactUs";

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin routes with Sidebar */}
        <Route
          path="/admin/*"
          element={
            <div className="flex h-screen">
              <Sidebar />
              <Routes>
                <Route path="hotel-listings" element={<HotelListings />} />
                <Route path="vehicle-listings" element={<VehicleListings />} />
                <Route path="users" element={<Users />} />
                <Route path="reports" element={<Reports />} />
                <Route path="ui-manage" element={<UIManage />} />
                {/* Default admin route */}
                <Route path="/" element={<AdminDashboard />} />
              </Routes>
            </div>
          }
        />
        {/* Contact Us route without Sidebar */}
        <Route path="/contact-us" element={<ContactUs />} />
        {/* Default route */}
        <Route path="/" element={<ContactUs />} />
        {/* Optional: Redirect for logout */}
        <Route path="/logout" element={<ContactUs />} />
      </Routes>
    </Router>
  );
}

export default App;