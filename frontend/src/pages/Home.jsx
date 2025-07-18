import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaStar, FaPlus, FaSpinner } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');

  const dummyFoods = [ /* your dummy foods remain unchanged */ ];
  const dummyCategories = [ /* your dummy categories remain unchanged */ ];

  useEffect(() => {
    const fetchFoods = async () => {
      try {
        const res = await axios.get('https://food-backend-xs3y.onrender.com/api/foods');
        setFoods(res.data);

        const uniqueCategories = [...new Set(res.data.map(item => item.category.toLowerCase()))];
        const formattedCategories = uniqueCategories.map(cat => ({
          id: cat,
          name: `${cat.charAt(0).toUpperCase()}${cat.slice(1)}`
        }));
        setCategories([{ id: 'all', name: 'All Items' }, ...formattedCategories]);
      } catch (err) {
        console.error('API error, using dummy data:', err);
        setFoods(dummyFoods);
        setCategories(dummyCategories);
      } finally {
        setLoading(false);
      }
    };

    fetchFoods();
  }, []);

  const addToCart = (food) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItem = cart.find(item => item._id === food._id);

    if (existingItem) {
      cart = cart.map(item =>
        item._id === food._id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      cart.push({ ...food, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${food.name} added to cart!`);
  };

  const filteredFoods =
    activeCategory === 'all'
      ? foods
      : foods.filter(food => food.category.toLowerCase() === activeCategory);

  return (
    <div className="home-container">
      <div className="hero-section">
        <div className="hero-content">
          {/* Optional hero content */}
        </div>
      </div>

      <div className="food-menu-container">
        <h2 className="section-title">Our Menu</h2>

        <div className="category-filter">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-spinner">
            <FaSpinner className="spinner-icon" />
            <p>Loading menu...</p>
          </div>
        ) : (
          <div className="food-grid">
            {filteredFoods.map(food => (
              <div key={food._id} className="food-card">
                {food.popular && <span className="popular-badge">Popular</span>}
                <div className="food-image-container">
                  <img
                    src={food.image || 'https://source.unsplash.com/random/300x200/?food'}
                    alt={food.name}
                    className="food-image"
                  />
                </div>
                <div className="food-details">
                  <div className="food-header">
                    <h3>{food.name}</h3>
                    <div className="food-rating">
                      <FaStar className="star-icon" />
                      <span>{food.rating || '4.0'}</span>
                    </div>
                  </div>
                  <p className="food-description">{food.description}</p>
                  <div className="food-footer">
                    <span className="food-price">₹{food.price}</span>
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(food)}
                    >
                      <FaPlus /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="features-section">
        <div className="feature-card">
          <div className="feature-icon">🚚</div>
          <h3>Fast Delivery</h3>
          <p>Get your food delivered in under 30 minutes</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🍔</div>
          <h3>Fresh Food</h3>
          <p>Made with high quality, fresh ingredients</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">💰</div>
          <h3>Best Prices</h3>
          <p>Affordable prices without compromising quality</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
