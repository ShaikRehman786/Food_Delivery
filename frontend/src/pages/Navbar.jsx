import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { toast } from 'react-toastify';  // ✅ Import toast

function Navbar() {
  const navigate = useNavigate();
  const role = localStorage.getItem('userRole');
  const isLoggedIn = !!localStorage.getItem('token');

  const handleLogout = () => {
    toast.dismiss();             
    toast.clearWaitingQueue();   
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/home" className="navbar-brand">🍽️ Food App</Link>
      </div>

      <div className="navbar-links">
        <Link to="/home" className="navbar-home-btn">Home</Link>

        {!isLoggedIn ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            {role === 'admin' && <Link to="/admin">Admin Dashboard</Link>}
            {role === 'chef' && <Link to="/chef">Chef Dashboard</Link>}
            {role === 'user' && (
              <>
                <Link to="/user">User Dashboard</Link>
                <Link to="/user/cart">Cart</Link>
              </>
            )}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
