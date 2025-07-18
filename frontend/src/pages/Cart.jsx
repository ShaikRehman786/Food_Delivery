
// src/pages/Cart.js
import React, { useEffect, useState } from 'react';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(items);
    setLoading(false);
  }, []);

  const updateQuantity = (id, change) => {
    const updatedCart = cart.map(item => {
      if (item._id === id) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const isFreeDelivery = subtotal > 499;
  const deliveryFee = isFreeDelivery ? 0 : (cart.length > 0 ? 40 : 0);
  const tax = subtotal * 0.05; // 5% tax
  const total = subtotal + deliveryFee + tax;

  const handleCheckout = () => {
    if (total > 0) {
      navigate('/checkout', { state: { amount: total.toFixed(2) } });
    } else {
      alert('Your cart is empty. Please add items before checkout.');
    }
  };

  if (loading) {
    return (
      <div className="cart-loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>Your Cart</h1>
        <Link to="/home" className="continue-shopping">Continue Shopping</Link>
      </div>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <img
            src="https://cdni.iconscout.com/illustration/premium/thumb/empty-cart-5521508-4610092.png"
            alt="Empty cart"
            className="empty-cart-image"
          />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet</p>
          <Link to="/home" className="shop-now-btn">Browse Menu</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {isFreeDelivery && (
              <div className="free-delivery-banner">
                <span className="offer-tag">OFFER</span>
                <span>🎉 Congrats! You've unlocked FREE delivery on this order</span>
              </div>
            )}
            {!isFreeDelivery && subtotal > 0 && (
              <div className="delivery-offer-banner">
                <span>🛵 Add ₹{(500 - subtotal).toFixed(2)} more to get FREE delivery</span>
              </div>
            )}
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-image">
                  <img
                    src={item.image || 'https://source.unsplash.com/random/200x200/?food'}
                    alt={item.name}
                  />
                </div>
                <div className="item-details">
                  <h3>{item.name}</h3>
                  <p className="item-description">{item.description}</p>
                  <div className="item-price">₹{item.price}</div>
                </div>
                <div className="item-quantity">
                  <button
                    onClick={() => updateQuantity(item._id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, 1)}>
                    <FaPlus />
                  </button>
                </div>
                <div className="item-total">₹{(item.price * item.quantity).toFixed(2)}</div>
                <button className="remove-item" onClick={() => removeItem(item._id)}>
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span className={isFreeDelivery ? 'free-delivery' : ''}>
                {isFreeDelivery ? 'FREE' : `₹${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="summary-row">
              <span>Tax (5%)</span>
              <span>₹{tax.toFixed(2)}</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
            <p className="secure-checkout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1ZM12 11.99H19C18.47 16.11 15.72 19.78 12 20.93V12H5V6.3L12 3.19V11.99Z" fill="#4CAF50"/>
              </svg>
              Secure Checkout
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
