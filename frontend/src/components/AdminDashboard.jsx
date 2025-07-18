import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './css/AdminDashboard.css';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';

const API_BASE = 'http://localhost:5000';

const AdminDashboard = () => {
  const [foods, setFoods] = useState([]);
  const [chefs, setChefs] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const token = localStorage.getItem('token');

    if (!token && !hasRedirected.current && location.pathname === '/admin') {
      hasRedirected.current = true;
      toast.dismiss();
      toast.clearWaitingQueue();
      toast.error('Please login as admin', {
        autoClose: 1500,
        onClose: () => navigate('/login'),
      });
      return;
    }

    const fetchData = async () => {
      try {
        const config = getAuthConfig();
        const [foodsRes, chefsRes, usersRes] = await Promise.all([
          axios.get(`${API_BASE}/api/foods?includeUnapproved=true`, config),
          axios.get(`${API_BASE}/api/users?role=chef&includeUnapproved=true`, config),
          axios.get(`${API_BASE}/api/users?role=user`, config),
        ]);
        if (isMounted) {
          setFoods(foodsRes.data);
          setChefs(chefsRes.data);
          setUsers(usersRes.data);
        }
      } catch (err) {
        if (isMounted) {
          console.error('Admin data load failed:', err.response?.data || err.message);
          toast.error('Failed to fetch admin data');
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [navigate, location.pathname]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchAllData = async () => {
    try {
      const config = getAuthConfig();
      const [foodsRes, chefsRes, usersRes] = await Promise.all([
        axios.get(`${API_BASE}/api/foods?includeUnapproved=true`, config),
        axios.get(`${API_BASE}/api/users?role=chef&includeUnapproved=true`, config),
        axios.get(`${API_BASE}/api/users?role=user`, config),
      ]);
      setFoods(foodsRes.data);
      setChefs(chefsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error('Admin data reload failed:', err.response?.data || err.message);
      toast.error('Failed to reload data');
    }
  };

  const approveChef = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/users/${id}/approve`, {}, getAuthConfig());
      toast.success('Chef approved successfully');
      fetchAllData();
    } catch {
      toast.error('Chef approval failed');
    }
  };

  const approveFood = async (id) => {
    try {
      await axios.patch(`${API_BASE}/api/foods/${id}/approve`, {}, getAuthConfig());
      toast.success('Food item approved');
      fetchAllData();
    } catch {
      toast.error('Failed to approve food');
    }
  };

  const deleteUser = async (id, role) => {
    try {
      await axios.delete(`${API_BASE}/api/users/${id}`, getAuthConfig());
      toast.success(`${role} deleted`);
      fetchAllData();
    } catch {
      toast.error('Delete failed');
    }
  };

  const deleteFood = async (id) => {
    try {
      await axios.delete(`${API_BASE}/api/foods/${id}`, getAuthConfig());
      toast.success('Food item deleted');
      fetchAllData();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <section>
        <h2>All Food Items</h2>
        {foods.length === 0 ? (
          <p>No food items available.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Chef</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id}>
                  <td>{food.name}</td>
                  <td>{food.category}</td>
                  <td>₹{food.price}</td>
                  <td>{food.chef?.name || 'Unknown'}</td>
                  <td>{food.approved ? 'Approved' : 'Pending'}</td>
                  <td>
                    {!food.approved && (
                      <button onClick={() => approveFood(food._id)}>Approve</button>
                    )}
                    <button onClick={() => deleteFood(food._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Registered Chefs</h2>
        {chefs.length === 0 ? (
          <p>No chefs found.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {chefs.map((chef) => (
                <tr key={chef._id}>
                  <td>{chef.name}</td>
                  <td>{chef.email}</td>
                  <td>{chef.approved ? 'Approved' : 'Pending'}</td>
                  <td>
                    {!chef.approved && (
                      <button onClick={() => approveChef(chef._id)}>Approve</button>
                    )}
                    <button onClick={() => deleteUser(chef._id, 'Chef')}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section>
        <h2>Registered Users</h2>
        {users.length === 0 ? (
          <p>No users registered.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button onClick={() => deleteUser(user._id, 'User')}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
