// src/api/otpApi.js
import axios from 'axios';

const BASE_URL = 'https://food-backend-xs3y.onrender.com';

export const sendOtp = async (email) => {
  return await axios.post(`${BASE_URL}/api/otp/send`, { email });
};

export const verifyOtp = async (email, otp) => {
  return await axios.post(`${BASE_URL}/api/otp/verify`, { email, otp });
};
