import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Clear any lingering toasts on mount
  useEffect(() => {
    toast.dismiss();
    toast.clearWaitingQueue();
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;

      if (token && user?.role) {
        // ✅ Check approval if user is a chef
        if (user.role === 'chef' && !user.approved) {
          toast.warning('Your chef account is not yet approved by the admin.');
          setIsLoading(false);
          return;
        }

        // ✅ Store user info in localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', user.role);
        localStorage.setItem('userId', user.id);
        localStorage.setItem('userName', user.name);

        toast.success(`Login successful! Redirecting to ${user.role} page...`);

        setTimeout(() => {
          if (user.role === 'admin') navigate('/admin');
          else if (user.role === 'chef') navigate('/chef');
          else navigate('/user');
        }, 1500);
      } else {
        toast.error('Login failed: Invalid response from server');
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
        <p className="subtitle">Please enter your credentials</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn custom-green-btn" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="signup-section">
          <p>Don't have an account?</p>
          <button type="button" onClick={goToSignup} className="signup-btn custom-purple-btn">
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
