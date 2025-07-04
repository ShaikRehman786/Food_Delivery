import express from 'express';
import User from '../models/User.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/users
// @desc    Get all users, optionally filtered by role and approval status
// @access  Private (Admin)
router.get('/', verifyToken, allowRoles('admin'), async (req, res) => {
  try {
    const { role, includeUnapproved } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (includeUnapproved !== 'true') filter.approved = true;

    const users = await User.find(filter).select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
});

// @route   PATCH /api/users/:id/approve
// @desc    Approve a user (usually a chef)
// @access  Private (Admin)
router.patch('/:id/approve', verifyToken, allowRoles('admin'), async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to approve user', error: err.message });
  }
});

// @route   DELETE /api/users/:id
// @desc    Delete a user
// @access  Private (Admin)
router.delete('/:id', verifyToken, allowRoles('admin'), async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });

    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete user', error: err.message });
  }
});



// @route   GET /api/users/:id
// @desc    Get a single user by ID
// @access  Private (Logged-in user, admin, or chef)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Optional: prevent users from accessing others' data unless admin
    if (req.user.id !== user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


export default router;
