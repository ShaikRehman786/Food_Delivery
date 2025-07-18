// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './Login.css';

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     toast.dismiss();
//     toast.clearWaitingQueue();
//   }, []);

//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/login', {
//         email,
//         password,
//       });

//       const { otpToken } = response.data;

//       if (otpToken) {
//         toast.success('OTP sent to your email');
//         navigate('/verify-otp', { state: { email, otpToken } });
//       } else {
//         toast.error('Login did not return OTP token.');
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Login failed. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const goToSignup = () => navigate('/register');

//   return (
//     <div className="login-container">
//       <ToastContainer position="top-center" newestOnTop />
//       <div className="login-card">
//         <h2>Welcome Back</h2>

//         <form onSubmit={handleLogin} className="login-form">
//           <div className="form-group">
//             <label>Email</label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button type="submit" disabled={isLoading}>
//             {isLoading ? 'Logging in...' : 'Login'}
//           </button>
//         </form>

//         <div>
//           <p>Don't have an account?</p>
//           <button onClick={goToSignup}>Create Account</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Login;





















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import { useUser } from '../components/UserContext'; // ✅ Import the context

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser(); // ✅ Get the login function from context

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

      const { otpToken, username } = response.data;

      if (username) {
        login(username); // ✅ Set the username in context
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
}

export default Login;
