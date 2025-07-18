import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/ChefDashboard.css';

function ChefDashboard() {
  const [foods, setFoods] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    description: '',
    category: '',
  });
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem('token');
  const chefId = localStorage.getItem('userId');

  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const fetchChefFoods = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/foods/chef/${chefId}`, { headers });
      setFoods(res.data);
    } catch (err) {
      toast.error('Failed to load your food items');
    }
  };

  useEffect(() => {
    if (chefId) fetchChefFoods();
  }, [chefId]);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    const { name, price, image, description, category } = formData;

    if (!name || !price || !image || !description || !category) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/foods/${editId}`, formData, { headers });
        toast.success('Item updated!');
        setEditId(null);
      } else {
        await axios.post('http://localhost:5000/api/foods', formData, { headers });
        toast.success('Item added!');
      }

      setFormData({ name: '', price: '', image: '', description: '', category: '' });
      fetchChefFoods();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error submitting item');
    }
  };

  const handleEditClick = (item) => {
    setEditId(item._id);
    setFormData({
      name: item.name,
      price: item.price,
      image: item.image,
      description: item.description,
      category: item.category,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/foods/${id}`, { headers });
      toast.success('Item deleted');
      setFoods(foods.filter(item => item._id !== id));
    } catch (err) {
      toast.error('Error deleting item');
    }
  };

  return (
    <div className="chef-dashboard">
      <ToastContainer position="top-center" newestOnTop />
      <h2>Chef Dashboard</h2>

      <form onSubmit={handleAddItem} className="add-food-form">
        <input type="text" name="name" placeholder="Food Name" value={formData.name} onChange={handleInput} />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleInput} />
        <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleInput} />
        <input type="text" name="category" placeholder="Category (e.g., Dessert)" value={formData.category} onChange={handleInput} />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleInput} />
        <button type="submit">{editId ? 'Update Item' : 'Add Food Item'}</button>
      </form>

      <div className="food-list">
        <h3>Your Food Items</h3>
        {foods.length === 0 ? (
          <p>No items found</p>
        ) : (
          <div className="food-grid">
            {foods.map(item => (
              <div className="food-card" key={item._id}>
                <img src={item.image} alt={item.name} />
                <h4>{item.name}</h4>
                <p>{item.description}</p>
                <p><strong>Price:</strong> ₹{item.price}</p>
                <p><strong>Category:</strong> {item.category}</p>
                <button onClick={() => handleEditClick(item)}>Edit</button>
                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChefDashboard;
