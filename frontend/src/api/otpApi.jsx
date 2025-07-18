// src/api/otpApi.js
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const sendOtp = async (email) => {
  return await axios.post(`${BASE_URL}/api/otp/send`, { email });
};

export const verifyOtp = async (email, otp) => {
  return await axios.post(`${BASE_URL}/api/otp/verify`, { email, otp });
};
