import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Checkout.css';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const amount = location.state?.amount;

  const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;
  const backendBaseUrl = process.env.REACT_APP_BACKEND_URL;

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (!amount) {
      alert('No amount provided for checkout. Redirecting to cart...');
      navigate('/cart');
    }
  }, [amount, navigate]);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async () => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Check your internet.');
      return;
    }

    try {
      const { data: order } = await axios.post(
        `${backendBaseUrl}/api/payment/create-order`,
        { amount: amount * 100 }
      );

      const options = {
        key: razorpayKey,
        amount: order.amount,
        currency: order.currency,
        name: 'Food Ordering App',
        description: 'Payment for your order',
        order_id: order.id,
        handler: function (response) {
          setSuccessMessage(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        theme: { color: '#3399cc' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error('Error creating Razorpay order:', err);
      alert('Failed to initiate Razorpay payment. Please try again.');
    }
  };

  const handleCashOnDelivery = () => {
    setSuccessMessage('Order placed successfully with Cash on Delivery!');
  };

  const handlePayment = () => {
    if (paymentMethod === 'razorpay') {
      handleRazorpayPayment();
    } else if (paymentMethod === 'cod') {
      handleCashOnDelivery();
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      <p>Total Amount: <strong>₹{amount}</strong></p>

      <div className="payment-options">
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="razorpay"
            checked={paymentMethod === 'razorpay'}
            onChange={() => setPaymentMethod('razorpay')}
          /> Razorpay
        </label>
        <label>
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={() => setPaymentMethod('cod')}
          /> Cash on Delivery
        </label>
      </div>

      <button
        onClick={handlePayment}
        className="payment-button"
      >
        Proceed to Pay
      </button>

      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default Checkout;
