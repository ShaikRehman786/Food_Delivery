// import React, { useEffect } from 'react';
// import { Navigate, useNavigate } from 'react-router-dom';

// const ProtectedRoute = ({ userRole, allowedRole, children }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('authToken');
//     if (!token) {
//       navigate('/login');
//     }
//   }, [navigate]);

//   const role = userRole || localStorage.getItem('userRole');

//   if (role !== allowedRole) {
//     return <Navigate to="/login" replace />;
//   }

//   return children;
// };

// export default ProtectedRoute;















// components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;
