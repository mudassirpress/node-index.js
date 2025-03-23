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


module.exports = VendorRouter;
