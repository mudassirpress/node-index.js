const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Vendor = require('../models/vendor');

const auth = async (req, res, next) => {
    try {
        const token = req.header('x-auth-token');
        if (!token) {
            return res.status(401).json({ message: "No authentication token, authorization denied" });
        }

        const verified = jwt.verify(token, "passwordKey"); // Fixed method
        if (!verified) {
            return res.status(401).json({ message: "Token verification failed, authorization denied" });
        }

        const user = await User.findById(verified.id) || await Vendor.findById(verified.id);
        if (!user) {
            return res.status(401).json({ message: "User or Vendor not found, authorization denied" });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

const vendorAuth = (req, res, next) => {
    try {
        if (req.user?.role !== "vendor") {  // Added optional chaining
            return res.status(403).json({ message: "Access denied. Only vendors are allowed" });
        }
        next();
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

module.exports = { auth, vendorAuth };
