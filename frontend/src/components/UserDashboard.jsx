import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useUser } from './UserContext';
import './css/UserDashboard.css';

function UserDashboard() {
  const { username } = useUser();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatDate = (date) =>
    date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  const formatTime = (date) =>
    date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  // ✅ Check if current route is cart
  const isCartPage = location.pathname.includes('/user/cart');

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        {!isCartPage && (
          <div className="greeting" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2>Hello, {username || 'Guest'}!</h2>
            <p>{formatDate(currentTime)}</p>
            <p>Current time: {formatTime(currentTime)}</p>
          </div>
        )}

        <ul>
          <li><Link to="/user/dashboard">Dashboard</Link></li>
          <li><Link to="/user/orders">Orders</Link></li>
          <li><Link to="/user/profile">Profile</Link></li>
          <li><Link to="/user/settings">Settings</Link></li>
        </ul>
      </aside>

      <main className="main-content">
        {!isCartPage && (
          <div className="centered-message">
            <h2>Welcome back, {username || 'Guest'}!</h2>
            <p>{formatDate(currentTime)}</p>
            <p>Current time: {formatTime(currentTime)}</p>
            <p className="welcome-message">
              {`Hope you're having a great day, ${username || 'Guest'}! Let's get started.`}
            </p>
          </div>
        )}
        <Outlet />
      </main>

      {!isCartPage && (
        <aside className="helpdesk">
          <h3>Helpdesk</h3>
          <img src="/helpdesk-icon.png" alt="Helpdesk" />
          <p>Contact: +91 9701765821</p>
          <p>Email: support@example.com</p>
        </aside>
      )}
    </div>
  );
}

export default UserDashboard;
