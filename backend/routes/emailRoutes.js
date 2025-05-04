const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();

const router = express.Router();

// Mock storage for verification codes (use Redis or a database in production)
const verificationCodes = new Map();

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post('/send-verification-email', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes.set(email, { code, expires: Date.now() + 15 * 60 * 1000 }); // Expires in 15 minutes

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification Code',
      text: `Your verification code is: ${code}. It expires in 15 minutes.`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Verification code sent to your email.' });
  } catch (error) {
    console.error('Error sending verification email:', error);
    res.status(500).json({ success: false, message: 'Failed to send verification email.' });
  }
});

router.post('/verify-email-code', (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ success: false, message: 'Email and code are required' });
    }

    const storedData = verificationCodes.get(email);
    if (!storedData) {
      return res.status(400).json({ success: false, message: 'No verification code found for this email.' });
    }

    if (storedData.expires < Date.now()) {
      verificationCodes.delete(email);
      return res.status(400).json({ success: false, message: 'Verification code has expired.' });
    }

    if (storedData.code !== code) {
      return res.status(400).json({ success: false, message: 'Invalid verification code.' });
    }

    verificationCodes.delete(email);
    res.json({ success: true, message: 'Email verified successfully.' });
  } catch (error) {
    console.error('Error verifying email code:', error);
    res.status(500).json({ success: false, message: 'Failed to verify email code.' });
  }
});

module.exports = router;