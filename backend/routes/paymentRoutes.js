// routes/paymentRoutes.js
import express from 'express';
import Razorpay from 'razorpay';

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
router.post('/create-order', async (req, res) => {
  try {
    const { amount } = req.body;
    console.log('Received amount from frontend:', amount);
    console.log('RAZORPAY_KEY_ID:', process.env.RAZORPAY_KEY_ID);
    console.log('RAZORPAY_KEY_SECRET:', process.env.RAZORPAY_KEY_SECRET);

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    const options = {
      amount: amount, 
      currency: 'INR',
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);
    console.log('Order created successfully:', order);
    res.status(200).json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ message: 'Failed to create Razorpay order', error: error.message });
  }
});


export default router;
