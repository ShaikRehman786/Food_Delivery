// src/api/otpApi.js
import axios from 'axios';

export const sendOtp = async (email) => {
  return await axios.post('http://localhost:5000/api/otp/send', { email });
};

export const verifyOtp = async (email, otp) => {
  return await axios.post('http://localhost:5000/api/otp/verify', { email, otp });
};
