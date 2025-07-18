import axios from 'axios';
import { useState } from 'react';

const RazorpayCheckout = ({ amount }) => {
  const [loading, setLoading] = useState(false);
  const API_BASE = process.env.REACT_APP_BACKEND_URL;

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (loading) return;
    setLoading(true);

    const res = await loadRazorpayScript();

    if (!res) {
      alert('Failed to load Razorpay SDK. Check your internet connection.');
      setLoading(false);
      return;
    }

    try {
      const { data: order } = await axios.post(`${API_BASE}/api/payment/create-order`, {
        amount: amount, // in INR
      });

      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: order.id,
        handler: function (response) {
          console.log('Payment Success:', response);
          alert(`Payment Successful. Payment ID: ${response.razorpay_payment_id}`);
        },
        prefill: {
          name: 'Test User',
          email: 'test@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert('Payment initialization failed. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handlePayment} disabled={loading}>
      {loading ? 'Processing...' : `Pay ₹${amount}`}
    </button>
  );
};

export default RazorpayCheckout;
