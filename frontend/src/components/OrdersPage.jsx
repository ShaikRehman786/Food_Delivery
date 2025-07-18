import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE = 'http://localhost:5000';

function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/orders/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch {
      toast.error('Failed to fetch orders');
    }
  };

  return (
    <section>
      <h2>Order History</h2>
      {orders.length ? (
        orders.map(order => (
          <div key={order._id} className="order-card">
            <p><strong>Order ID:</strong> {order._id}</p>
            <p><strong>Items:</strong> {order.items.map(i => i.name).join(', ')}</p>
            <p><strong>Total:</strong> ₹{order.total}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : <p>No orders available.</p>}
    </section>
  );
}

export default OrdersPage;
