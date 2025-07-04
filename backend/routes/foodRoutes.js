import express from 'express';
import FoodItem from '../models/FoodItem.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/foods
// @desc    Fetch all food items, optionally include unapproved
// @access  Public (Admin sees all, public sees approved only)
router.get('/', async (req, res) => {
  try {
    const includeUnapproved = req.query.includeUnapproved === 'true';
    const foods = await FoodItem.find(includeUnapproved ? {} : { approved: true })
      .populate('chef', 'name email');
    res.status(200).json(foods);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch food items', error: err.message });
  }
});

// @route   POST /api/foods
// @desc    Create a new food item (chef only)
// @access  Private (Chef)
router.post('/', verifyToken, allowRoles('chef'), async (req, res) => {
  const { name, price, description, category, image } = req.body;

  try {
    const newItem = new FoodItem({
      name,
      price,
      description,
      category,
      image,
      chef: req.user.id,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create food item', error: err.message });
  }
});

// @route   GET /api/foods/chef/:id
// @desc    Get all food items created by a specific chef
// @access  Public
router.get('/chef/:id', async (req, res) => {
  try {
    const items = await FoodItem.find({ chef: req.params.id });
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch chef items', error: err.message });
  }
});

// @route   DELETE /api/foods/:id
// @desc    Delete a food item
// @access  Private (Chef or Admin)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Admin can delete any, chef can delete only their own
    if (req.user.role !== 'admin' && item.chef.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await FoodItem.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting item', error: err.message });
  }
});

// @route   PUT /api/foods/:id
// @desc    Update a food item
// @access  Private (Chef only)
router.put('/:id', verifyToken, allowRoles('chef'), async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.chef.toString() !== req.user.id)
      return res.status(403).json({ message: 'Unauthorized' });

    const updated = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update item', error: err.message });
  }
});

// @route   PATCH /api/foods/:id/approve
// @desc    Approve a food item (Admin only)
// @access  Private (Admin)
router.patch('/:id/approve', verifyToken, allowRoles('admin'), async (req, res) => {
  try {
    const updatedItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!updatedItem) return res.status(404).json({ message: 'Item not found' });
    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ message: 'Approval failed', error: err.message });
  }
});

export default router;
