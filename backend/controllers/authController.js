// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcryptjs';
// import User from '../models/User.js';
// import { sendEmail } from '../services/mailService.js';
// import { generateOTP } from '../utils/otpGenerator.js';

// // Generate JWT for authentication
// const generateToken = (user) => {
//   return jwt.sign(
//     { id: user._id, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: '1d' }
//   );
// };

// // Generate OTP token (short-lived)
// const generateOtpToken = (email) => {
//   return jwt.sign(
//     { email },
//     process.env.OTP_SECRET || 'otp_secret_key',
//     { expiresIn: '5m' }
//   );
// };

// // @desc    Register a new user
// // @route   POST /api/auth/register
// export const registerUser = async (req, res) => {
//   const { name, email, password, role } = req.body;

//   try {
//     const userExists = await User.findOne({ email });
//     if (userExists)
//       return res.status(400).json({ message: 'User already exists' });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       email,
//       password: hashedPassword,
//       role: role || 'user',
//     });

//     // Generate OTP and send via email
//     const otp = generateOTP();
//     await sendEmail(email, otp);

//     // Save OTP in memory or your preferred store
//     user.otp = otp; // Optionally, store directly or via an OTP store
//     await user.save();

//     const otpToken = generateOtpToken(email);

//     res.status(201).json({
//       message: 'Registration successful! OTP sent to your email.',
//       otpToken
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Registration failed', error: error.message });
//   }
// };

// // @desc    Login user & get token
// // @route   POST /api/auth/login
// export const loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user)
//       return res.status(401).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(401).json({ message: 'Invalid credentials' });

//     // Generate OTP
//     const otp = generateOTP();
//     user.otp = otp;
//     await user.save();

//     // Send OTP
//     await sendEmail(email, otp);

//     // Generate otpToken
//     const otpToken = generateOtpToken(email);

//     res.json({
//       message: 'OTP sent to your email',
//       otpToken
//     });

//   } catch (error) {
//     res.status(500).json({ message: 'Login failed', error: error.message });
//   }
// };



// // @desc    Get current logged-in user profile
// // @route   GET /api/auth/profile
// // @access  Private
// export const getProfile = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select('-password');
//     if (!user) return res.status(404).json({ message: 'User not found' });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
//   }
// };


// // Inside authController.js
// export const verifyOtpController = async (req, res) => {
//   const { email, otp, otpToken } = req.body;

//   if (!email || !otp || !otpToken) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     // Verify otpToken (optional: validate token expiration etc.)
//     const decoded = jwt.verify(otpToken, process.env.OTP_SECRET || 'otp_secret_key');
//     if (decoded.email !== email) {
//       return res.status(400).json({ message: 'OTP token does not match email' });
//     }

//     // Find user
//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Check OTP
//     if (user.otp !== otp) {
//       return res.status(400).json({ message: 'Invalid or expired OTP' });
//     }

//     // Clear OTP after successful verification
//     user.otp = null;
//     await user.save();

//     // Generate auth token (session token)
//     const token = generateToken(user);

//     res.status(200).json({
//   token,
//   role: user.role,
//   userId: user._id
// });


//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: 'Server error verifying OTP', error: err.message });
//   }
// };



























import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { sendEmail } from '../services/mailService.js';
import { generateOTP } from '../utils/otpGenerator.js';

// Generate JWT for authentication
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Generate OTP token (short-lived)
const generateOtpToken = (email) => {
  return jwt.sign(
    { email },
    process.env.OTP_SECRET || 'otp_secret_key',
    { expiresIn: '5m' }
  );
};

// @desc Register a new user
// @route POST /api/auth/register
export const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user',
    });

    const otp = generateOTP();
    await sendEmail(email, otp);

    user.otp = otp;
    await user.save();

    const otpToken = generateOtpToken(email);

    res.status(201).json({
      message: 'Registration successful! OTP sent to your email.',
      otpToken,
      username: user.name // ✅ Return username
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

// @desc Login user & get token
// @route POST /api/auth/login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    await sendEmail(email, otp);

    const otpToken = generateOtpToken(email);

    res.json({
      message: 'OTP sent to your email',
      otpToken,
      username: user.name // ✅ Return username here
    });

  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
};

// @desc Get current logged-in user profile
// @route GET /api/auth/profile
// @access Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user profile', error: error.message });
  }
};

// @desc Verify OTP
// @route POST /api/auth/verify-otp
export const verifyOtpController = async (req, res) => {
  const { email, otp, otpToken } = req.body;

  if (!email || !otp || !otpToken) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const decoded = jwt.verify(otpToken, process.env.OTP_SECRET || 'otp_secret_key');
    if (decoded.email !== email) {
      return res.status(400).json({ message: 'OTP token does not match email' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }

    user.otp = null;
    await user.save();

    const token = generateToken(user);

    res.status(200).json({
      token,
      role: user.role,
      userId: user._id,
      username: user.name // ✅ Return username after OTP verification too
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error verifying OTP', error: err.message });
  }
};
