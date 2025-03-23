const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {auth, vendorAuth} = require('../middleware/auth'); // JWT Authentication Middleware

const authRouter = express.Router();

// 🔹 User Signup
authRouter.post('/api/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let user = new User({ fullname, email, password: hashedPassword });
        user = await user.save();

        res.json({ user });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 🔹 User Sign In
authRouter.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "User not found with this email" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ id: user._id }, "passwordKey", { expiresIn: "1d" });
        const { password: _, ...userWithoutPassword } = user._doc;

        res.json({ token, user: userWithoutPassword });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// 🔹 Change Password Route (Protected)
authRouter.put('/api/change-password',auth,vendorAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id; // Extract user ID from JWT token

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Verify old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect old password" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);

        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 🔹 Update User Profile
authRouter.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid User ID format" });
        }

        const { state, city, locality } = req.body;
        if (!state || !city || !locality) {
            return res.status(400).json({ error: "All fields are required (state, city, locality)" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id, { state, city, locality }, { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(500).json({ error: "Unknown error occurred" });
    }
});

// 🔹 Get All Users (without passwords)
authRouter.get('/api/users', async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = authRouter;
