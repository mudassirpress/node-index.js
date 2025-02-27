const express = require('express');
const ProductReview = require('../models/product_review');
const productreviewRouter = express.Router();
const Product = require('../models/product');

productreviewRouter.post('/api/product_review', async (req, res) => {
    try {
        const { buyerId, email, fullName, productId, rating, review } = req.body;

        // Check if the user already reviewed the product
        const existingReview = await ProductReview.findOne({ buyerId, productId });
        if (existingReview) {
            return res.status(400).json({ message: "You have already reviewed this product" });
        }

        // Create and save the new review
        const newReview = new ProductReview({
            buyerId,
            email,
            fullName,
            productId,
            rating,
            review,
        });

        await newReview.save();

        // Find the product to update its ratings
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Ensure totalRatings is initialized properly
        product.totalRatings = product.totalRatings || 0;
        product.averageRating = product.averageRating || 0;

        // Update total ratings and average rating
        product.totalRatings += 1;
        product.averageRating =
            (product.averageRating * (product.totalRatings - 1) + rating) / product.totalRatings;

        await product.save();

        return res.status(201).json(newReview);
    } catch (e) {
        console.error("Error in product review:", e);
        res.status(500).json({ error: "An unknown error occurred" });
    }
});

// Get all product reviews
productreviewRouter.get('/api/product_review', async (req, res) => {
    try {
        const productReviews = await ProductReview.find();
        res.status(200).json(productReviews);
    } catch (e) {
        console.error("Error fetching reviews:", e);
        res.status(500).json({ error: "An unknown error occurred" });
    }
});

module.exports = productreviewRouter;
