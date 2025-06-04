const express = require('express');
const mongoose = require("mongoose");
const cors = require('cors');

// Import Routes
const authRouter = require('./routes/auth');
const bannerRouter = require('./routes/banner');
const categoryRouter = require('./routes/category');
const subCategoryRouter = require('./routes/subCategory');
const productRouter = require('./routes/product');
const productreviewRouter = require('./routes/product_review');
const VendorRouter = require('./routes/vendor');
const orderRouter = require('./routes/orders');

const port = process.env.PORT || 3001;
const app = express();

// MongoDB Connection String
const DB = "mongodb+srv://mudassirmohibali:mudassirali@cluster0.iwc31.mongodb.net/?retryWrites=true&w=majority";

// Middleware
app.use(express.json());
app.use(cors());

// Register Routes (this can be delayed if needed)
// Note: We will only apply these after DB connects.

mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("✅ MongoDB connected");

    // Register Routes AFTER connection is successful
    app.use(authRouter);
    app.use(bannerRouter);
    app.use(categoryRouter);
    app.use(subCategoryRouter);
    app.use(productRouter);
    app.use(productreviewRouter);
    app.use(VendorRouter);
    app.use(orderRouter);

    // Start the server AFTER DB connection
    app.listen(port, "0.0.0.0", () => {
        console.log(`🚀 Server is running on port ${port}`);
    });

}).catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
});
