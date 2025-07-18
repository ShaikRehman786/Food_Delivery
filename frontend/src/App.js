import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminDashboard from './components/AdminDashboard';
import ChefDashboard from './components/ChefDashboard';
import UserDashboard from './components/UserDashboard';
import DashboardHome from './components/DashboardHome';
import OrdersPage from './components/OrdersPage';
import ProfilePage from './components/ProfilePage';
import SettingsPage from './components/SettingsPage';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './pages/Navbar';
import Home from './pages/Home';
import VerifyOtp from './pages/VerifyOtp';
import Checkout from './pages/Checkout';
import { Navigate } from 'react-router-dom';


import { UserProvider } from './components/UserContext';  // <-- import your UserProvider

function App() {
  return (
    <UserProvider>    {/* <-- Wrap everything inside UserProvider */}
      <Router>
        <Navbar />
        <ToastContainer position="top-center" autoClose={3000} />

        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/checkout" element={<Checkout />} />

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Chef */}
          <Route
            path="/chef"
            element={
              <ProtectedRoute allowedRole="chef">
                <ChefDashboard />
              </ProtectedRoute>
            }
          />

          {/* User Dashboard with nested routes */}
          <Route
            path="/user"
            element={
              <ProtectedRoute allowedRole="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="cart" element={<Cart />} />
          </Route>
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
