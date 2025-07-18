// backend/server.js
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import foodRoutes from './routes/foodRoutes.js';
import userRoutes from './routes/userRoutes.js';
import otpRoutes from './routes/otpRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';



const app = express();

// Middlewares
const corsOptions = {
  origin: 'http://localhost:3000',  // Frontend React app URL
  credentials: true,                // Allow cookies/headers
};

app.use(cors(corsOptions));

app.use(express.json());

// Health Check
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/users', userRoutes);
app.use('/api/otp', otpRoutes);
app.use('/api/payment',paymentRoutes);
// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
