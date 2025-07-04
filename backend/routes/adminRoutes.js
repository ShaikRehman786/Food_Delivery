import express from 'express';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard-data', verifyToken, allowRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome to Admin Dashboard', usersCount: 50, ordersCount: 30 });
});


export default router; 
