import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./pages/AdminDashboard";
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
                <Route path="hotel-listings" element={<AdminDashboard />} />
                <Route path="vehicle-listings" element={<AdminDashboard />} />
                <Route path="users" element={<AdminDashboard />} />
                <Route path="reports" element={<AdminDashboard />} />
                <Route path="ui-manage" element={<AdminDashboard />} />
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
      </Routes>
    </Router>
  );
}

export default App;