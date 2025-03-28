const express = require('express');
const bcrypt = require('bcryptjs');
const Vendor = require('../models/vendor'); // ✅ Correct import
const VendorRouter = express.Router();
const jwt = require('jsonwebtoken'); 

// Vendor Signup
VendorRouter.post('/api/vendor/signup', async (req, res) => {
    try {
        const { fullname, email, password } = req.body;
        
        // Check if email already exists
        if (password.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }
        const existingEmail = await Vendor.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "User with the same email already exists" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new vendor
        let newVendor = new Vendor({ fullname, email, password: hashedPassword });
        newVendor = await newVendor.save();

        res.json({ vendor: newVendor });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Vendor Sign-in
VendorRouter.post("/api/vendor/signup", async (req, res) => {
    try {
        const { fullname, email, password } = req.body;

        // ✅ Full Name Validation (At least 3 characters, only letters & spaces)
        if (!fullname || fullname.length < 3 || !/^[A-Za-z\s]+$/.test(fullname)) {
            return res.status(400).json({ message: "Full Name must be at least 3 characters long and contain only letters." });
        }

        // ✅ Email Validation (Proper format)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.status(400).json({ message: "Please enter a valid email address." });
        }

        // ✅ Check if Email Already Exists
        const existingEmail = await Vendor.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ message: "User with the same email already exists." });
        }

        // ✅ Password Strength Validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({ 
                message: "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)." 
            });
        }

        // ✅ Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ Create new vendor
        let newVendor = new Vendor({
            fullname,
            email,
            password: hashedPassword
        });

        newVendor = await newVendor.save();

        res.status(201).json({ message: "Vendor registered successfully!", vendor: newVendor });

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});

// Get Vendor Emails
VendorRouter.get('/api/vendor/emails', async (req, res) => {
    try {
        const vendors = await Vendor.find().select('email');
        const emails = vendors.map(vendor => vendor.email);
        return res.status(200).json(emails);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
// Get All Vendors
VendorRouter.get('/api/vendors', async (req, res) => {
    try {
        const vendors = await Vendor.find().select('-password'); // Exclude password field
        return res.status(200).json(vendors);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});
VendorRouter.post('/api/vendor/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        // Verify token
        const decoded = jwt.verify(token, SECRET_KEY);
        if (!decoded) {
            return res.status(400).json({ message: "Invalid or expired token" });
        }

        // Find vendor and update password
        const vendor = await Vendor.findById(decoded.id);
        if (!vendor) {
            return res.status(400).json({ message: "Vendor not found" });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({ message: "Password must be at least 8 characters long" });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        vendor.password = await bcrypt.hash(newPassword, salt);
        await vendor.save();

        res.json({ message: "Password reset successful!" });

    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = VendorRouter;
