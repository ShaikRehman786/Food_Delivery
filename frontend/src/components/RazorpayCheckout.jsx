// components/RazorpayCheckout.js
import axios from 'axios';

const RazorpayCheckout = ({ amount }) => {

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
    const res = await loadRazorpayScript();

    if (!res) {
      alert('Failed to load Razorpay SDK. Check your internet connection.');
      return;
    }

    // 1. Create order on backend
    const { data: order } = await axios.post('http://localhost:5000/api/payment/create-order', {
      amount: amount, // in INR
    });

    // 2. Configure Razorpay options
    const options = {
      key: process.env.REACT_APP_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: 'Your Company Name',
      description: 'Test Transaction',
      order_id: order.id,
      handler: function (response) {
        // Handle successful payment here
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
  };

  return (
    <button onClick={handlePayment}>
      Pay ₹{amount}
    </button>
  );
};

export default RazorpayCheckout;
