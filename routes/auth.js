const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

// 🔹 User Signup
authRouter.post('/api/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // ✅ Hash Password password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Save New User
        let user = new User({ fullname, email, password: hashedPassword });
        user = await user.save();

        res.status(201).json({ message: "User registered successfully", user });
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
 
authRouter.get('/api/user', async (req, res) => {
    try {
        const users = await User.find(); // Exclude password field
        return res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

authRouter.delete('/api/user/:email/:password', async (req, res) => {
  try {
    const { email, password } = req.params;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    await User.deleteOne({ email });

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});



module.exports = authRouter;
