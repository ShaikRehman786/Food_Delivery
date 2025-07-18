// import { sendEmail } from '../services/mailService.js';
// import { generateOTP } from '../utils/otpGenerator.js';

// let otpStore = {};

// export const sendOtp = async (req, res) => {
//     const { email } = req.body;
//     const otp = generateOTP();
//     otpStore[email] = { otp, expires: Date.now() + 300000 }; // 5 min expiry

//     try {
//         await sendEmail(email, otp);
//         res.status(200).json({ message: 'OTP sent successfully!' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error sending OTP', error });
//     }
// };

// export const verifyOtp = (req, res) => {
//     const { email, otp } = req.body;
//     const record = otpStore[email];

//     if (record && record.otp == otp && Date.now() < record.expires) {
//         delete otpStore[email];
//         res.status(200).json({ message: 'OTP verified successfully' });
//     } else {
//         res.status(400).json({ message: 'Invalid or expired OTP' });
//     }
// };





















import { sendEmail } from '../services/mailService.js';
import { generateOTP } from '../utils/otpGenerator.js';
import User from '../models/User.js';

let otpStore = {};  // In-memory store. For production, use a DB or Redis.

// @desc    Send OTP to user email
// @route   POST /api/otp/send
export const sendOtp = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const otp = generateOTP();
    otpStore[email] = { otp, expires: Date.now() + 300000 }; // 5 min expiry

    try {
        await sendEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully!' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ message: 'Error sending OTP', error: error.message });
    }
};

// @desc    Verify OTP
// @route   POST /api/otp/verify
export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    const record = otpStore[email];

    if (record && record.otp == otp && Date.now() < record.expires) {
        delete otpStore[email]; // Clear OTP after successful verification

        // Optionally fetch user details
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'OTP verified successfully',
            userId: user._id,
            username: user.name,
            role: user.role
        });
    } else {
        return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
};
