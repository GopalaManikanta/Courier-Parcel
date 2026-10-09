import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ShipmentProvider } from './context/ShipmentContext';
import { CustomerProvider } from './context/CustomerContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Shipments from './pages/Shipments';
import ShipmentDetails from './pages/ShipmentDetails';
import Customers from './pages/Customers';
import CustomerProfile from './pages/CustomerProfile';
import ParcelTracking from './pages/ParcelTracking';

// Layout wrapper to show Navbar only on dashboard or protected pages
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isAuthPage = ['/login', '/register', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {!isAuthPage && <Navbar />}
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ShipmentProvider>
          <CustomerProvider>
          <Router>
            <MainLayout>
              <Routes>
                {/* Public Authentication Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tracking"
                  element={
                    <ProtectedRoute>
                      <ParcelTracking />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shipments"
                  element={
                    <ProtectedRoute>
                      <Shipments />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/shipments/:id"
                  element={
                    <ProtectedRoute>
                      <ShipmentDetails />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customers"
                  element={
                    <ProtectedRoute>
                      <Customers />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/customers/:id"
                  element={
                    <ProtectedRoute>
                      <CustomerProfile />
                    </ProtectedRoute>
                  }
                />

                {/* Default Redirect */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </MainLayout>

          {/* Global Toast Container */}
          <ToastContainer
            position="top-right"
            autoClose={3500}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
        </Router>
        </CustomerProvider>
      </ShipmentProvider>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
