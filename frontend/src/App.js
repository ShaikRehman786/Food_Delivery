// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AdminDashboard from './components/AdminDashboard';
import ChefDashboard from './components/ChefDashboard';
import UserDashboard from './components/UserDashboard';
import Cart from './pages/Cart';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './pages/Navbar';
import Home from './pages/Home';

function UserDashboardLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Navbar />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar={false} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Route */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Chef Route */}
        <Route
          path="/chef"
          element={
            <ProtectedRoute allowedRole="chef">
              <ChefDashboard />
            </ProtectedRoute>
          }
        />

        {/* User Routes with Nested Cart */}
        <Route
          path="/user"
          element={
            <ProtectedRoute allowedRole="user">
              <UserDashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<UserDashboard />} />
          <Route path="cart" element={<Cart />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
