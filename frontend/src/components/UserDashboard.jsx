import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './css/UserDashboard.css';
import { toast } from 'react-toastify';

const API_BASE = 'http://localhost:5000'; // Update with your backend base URL

function UserDashboard() {
  const [userDetails, setUserDetails] = useState(null);
  const [orders, setOrders] = useState([]);
  const hasFetched = useRef(false);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!token || !userId) {
      toast.error('Not logged in. Please login again.');
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    console.log("✅ Token:", token);
    console.log("✅ User ID:", userId);

    fetchUserDetails();
    fetchOrderHistory();
  }, []);

  const fetchUserDetails = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/users/${userId}`, { headers });
      console.log("👤 User Details:", res.data);
      setUserDetails(res.data);
    } catch (error) {
      console.error('❌ Failed to fetch user details:', error.response?.data || error.message);
      toast.error('Error loading user details');
    }
  };

  const fetchOrderHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/orders/user/${userId}`, { headers });
      console.log("📦 Order History:", res.data);
      setOrders(res.data);
    } catch (error) {
      console.error('❌ Failed to fetch order history:', error.response?.data || error.message);
      toast.error('Error loading order history');
    }
  };

  return (
    <div className="user-dashboard">
      <h2>User Dashboard</h2>

      {/* USER INFO */}
      {userDetails ? (
        <div className="user-info">
          <img
            src={userDetails.profileImage || '/default-avatar.png'}
            alt="User"
            className="user-profile-img"
          />
          <div className="user-details-text">
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
            <p><strong>Phone:</strong> {userDetails.phone || 'N/A'}</p>
            <p><strong>Address:</strong> {userDetails.address || 'N/A'}</p>
            <p><strong>Joined:</strong> {new Date(userDetails.createdAt).toLocaleDateString()}</p>
            <p><strong>Last Login:</strong> {userDetails.lastLogin ? new Date(userDetails.lastLogin).toLocaleString() : 'N/A'}</p>
          </div>
        </div>
      ) : (
        <p>Loading user info...</p>
      )}

      {/* ORDER HISTORY */}
      <div className="order-history">
        <h3>Order History</h3>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order._id} className="order-item">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Items:</strong> {order.items.map(i => i.name).join(', ')}</p>
                <p><strong>Total:</strong> ₹{order.total}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;
