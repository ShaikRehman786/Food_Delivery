import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './VerifyOtp.css';
import { useUser } from '../components/UserContext'; // ✅ Import context

function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useUser(); // ✅ Get login function from context

  const { email, otpToken } = location.state || {};
  const backendBaseUrl = process.env.REACT_APP_BACKEND_URL; // ✅ Load from env

  useEffect(() => {
    if (!email || !otpToken) {
      toast.error('Session expired. Please login again.');
      navigate('/login');
    }
  }, [email, otpToken, navigate]);

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      toast.error('Please enter a valid OTP.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${backendBaseUrl}/api/auth/verify-otp`, {
        email,
        otp,
        otpToken,
      });

      const { token, role, userId, username } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userId', userId);

      if (username) {
        login(username);
      }

      toast.success('OTP Verified! Redirecting...');

      setTimeout(() => {
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'chef') {
          navigate('/chef');
        } else if (role === 'user') {
          navigate('/home');
        } else {
          toast.error('Unknown role. Redirecting to login.');
          navigate('/login');
        }
      }, 1000);

    } catch (error) {
      toast.error(error.response?.data?.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="verify-otp-container">
      <ToastContainer position="top-center" newestOnTop />
      <h2>Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={handleVerify} disabled={isLoading}>
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </div>
  );
}

export default VerifyOtp;
