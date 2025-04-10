// const express = require('express');
// const jwt = require('jsonwebtoken');
// const User = require('../models/user');
// const nodemailer = require('nodemailer');
// const bcrypt = require('bcryptjs');
// require('dotenv').config();

// const passwordRrouter = express.Router();

// // 🔹 Forgot Password Route
// passwordRrouter.post('/api/forgot-password', async (req, res) => {
//   const { email } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'User not found' });

//     // Create a token valid for 15 minutes
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

//     // Create reset link
//     const resetLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

//     // Send email with link
//     const transporter = nodemailer.createTransport({
//       service: 'gmail',
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     const mailOptions = {
//       from: `OPD App <${process.env.EMAIL_USER}>`,
//       to: email,
//       subject: 'Password Reset',
//       html: `<p>Click <a href="${resetLink}">here</a> to reset your password. The link is valid for 15 minutes.</p>`,
//     };

//     await transporter.sendMail(mailOptions);

//     res.status(200).json({ message: 'Reset link sent to your email.' });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // 🔹 Reset Password Route
// passwordRrouter.post('/api/reset-password', async (req, res) => {
//   const { token, newPassword } = req.body;

//   try {
//     // Validate password strength
//     const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
//     if (!passwordRegex.test(newPassword)) {
//       return res.status(400).json({
//         message: 'Password must be at least 8 characters long and include uppercase, lowercase, a number, and a special character',
//       });
//     }

//     // Verify token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.id;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired token' });
//     }

//     // Hash new password
//     const salt = await bcrypt.genSalt(10);
//     user.password = await bcrypt.hash(newPassword, salt);

//     await user.save();

//     res.status(200).json({ message: 'Password reset successful' });
//   } catch (err) {
//     res.status(400).json({ message: 'Invalid or expired token' });
//   }
// });

// module.exports = passwordRrouter;
