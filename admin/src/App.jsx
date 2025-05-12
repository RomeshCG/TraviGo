// src/App.jsx (Admin Side)
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

import Dashboard from './pages/Dashboard';
import HotelDetails from './pages/HotelDetails'; // Import your HotelDetails component
import RentOrderSummaryPage from './pages/RentOrderSummaryPage'; // Import your RentOrderSummaryPage component
import HotelPaymentPage from './pages/HotelPaymentPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { isAuthenticated } = useAuth();

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/hotel/:id"
        element={
          <ProtectedRoute>
            <HotelDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/vehicles/order-summary"
        element={
          <ProtectedRoute>
            <RentOrderSummaryPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/hotels/payment"
        element={
          <ProtectedRoute>
            <HotelPaymentPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;