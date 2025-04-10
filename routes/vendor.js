const express = require('express');
const bcrypt = require('bcryptjs');
const Vendor = require('../models/vendor'); // ✅ Correct import
const VendorRouter = express.Router();
const jwt = require('jsonwebtoken'); 
const {auth, vendorAuth} = require('../middleware/auth');

// Vendor Signup
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

// Vendor Sign-in
VendorRouter.post('/api/vendor/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const findVendor = await Vendor.findOne({ email });

        if (!findVendor) {
            return res.status(400).json({ message: "User not found with this email" });
        }

        if (!findVendor.password) {
            return res.status(400).json({ message: "Password is missing for this user" });
        }

        const isMatch = await bcrypt.compare(password, findVendor.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ id: findVendor._id }, "passwordKey");

        // Remove password before sending response
        const vendorWithoutPassword = { ...findVendor._doc };
        delete vendorWithoutPassword.password;

        res.json({ token, vendor: vendorWithoutPassword });
    } catch (e) {
        res.status(500).json({ error: e.message });
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
// 🔹 Change Password Route (Protected)
VendorRouter.put('/api/change-password',auth,vendorAuth, async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const vendorId = req.vendor.id; // Extract user ID from JWT token

        const user = await Vendor.findById(vendorId);
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

module.exports = VendorRouter;
