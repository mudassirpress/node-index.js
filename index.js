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
const VendorRouter = require('./routes/vendor'); // Vendor Routes
const orderRouter = require('./routes/orders');

const port = process.env.PORT || 3000;
const app = express();

// MongoDB Connection String
const DB = "mongodb+srv://mudassirmohibali:mudassirali@cluster0.iwc31.mongodb.net/";

// Middleware
app.use(express.json());  // Enable JSON request parsing
app.use(cors());  // Enable CORS

// Register Routes
app.use(authRouter);
app.use(bannerRouter);
app.use(categoryRouter);
app.use(subCategoryRouter);
app.use(productRouter);
app.use(productreviewRouter);
app.use(VendorRouter);
app.use(orderRouter);

// Connect to MongoDB
mongoose.connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error("MongoDB connection error:", err);
});

// Start the server
app.listen(port, "0.0.0.0", function() {
    console.log(`Server is running on port ${port}`);
});
