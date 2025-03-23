const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

// 🔹 User Signup
authRouter.post('/api/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // ✅ Manually validate password before hashing
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

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
 

module.exports = authRouter;
