import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import { useUser } from '../components/UserContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const backendBaseUrl = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    toast.dismiss();
    toast.clearWaitingQueue();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${backendBaseUrl}/api/auth/login`,
        { email, password }
      );

      const { otpToken, username } = response.data;

      if (username) {
        login(username);
      }

      if (otpToken) {
        toast.success('OTP sent to your email');
        navigate('/verify-otp', { state: { email, otpToken } });
      } else {
        toast.error('Login did not return OTP token.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const goToSignup = () => navigate('/register');

  return (
    <div className="login-container">
      <ToastContainer position="top-center" newestOnTop />
      <div className="login-card">
        <h2>Welcome Back</h2>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div>
          <p>Don't have an account?</p>
          <button onClick={goToSignup}>Create Account</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
