import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Optional: verify transporter setup
transporter.verify((error, success) => {
    if (error) {
        console.error('Error with email transporter:', error);
    } else {
        console.log('Email transporter is ready');
    }
});

export const sendEmail = async (to, otp) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject: 'Your OTP Code',
        text: `Your OTP is ${otp}. It expires in 5 minutes.`
    });
};
