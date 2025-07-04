import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ userRole, allowedRole, children }) => {
  const role = userRole || localStorage.getItem('userRole');

  if (role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
