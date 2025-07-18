// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const router = express.Router();

// // @route   POST /api/auth/register
// // @desc    Register a new user
// router.post('/register', async (req, res) => {
//   console.log('Request body on register:', req.body);

//   const { name, email, password, role } = req.body;

//   // ✅ Validate input
//   const validRoles = ['user', 'chef', 'admin'];
//   if (!validRoles.includes(role)) {
//     return res.status(400).json({ message: 'Invalid role' });
//   }

//   try {
//     const existingUser = await User.findOne({ email });
//     if (existingUser)
//       return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const newUser = new User({
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       isAdmin: role === 'admin', // optional legacy support
//     });

//     await newUser.save();

//     res.status(201).json({ message: 'User created successfully' });
//   } catch (err) {
//     res.status(500).json({ message: 'Registration failed', error: err.message });
//   }
// });

// // @route   POST /api/auth/login
// // @desc    Authenticate user and return JWT
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: 'Invalid credentials' });

//     // 🔒 Add this check for chefs
//     if (user.role === 'chef' && !user.approved) {
//       return res.status(403).json({ message: 'Account is not approved by the admin' });
//     }

//     const token = jwt.sign(
//       {
//         id: user._id,
//         role: user.role,
//       },
//       process.env.JWT_SECRET,
//       { expiresIn: '1d' }
//     );

//     res.json({
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         approved: user.approved, // Optional: include approval status
//       },
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Login failed', error: err.message });
//   }
// });


// export default router;
















import express from 'express';
import { registerUser, loginUser, verifyOtpController } from '../controllers/authController.js';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user and return JWT
router.post('/login', loginUser);


router.post('/verify-otp', verifyOtpController);




export default router;
