const express = require('express');
const Category = require('../models/category');
const categoryRouter = express.Router();

// CREATE category
categoryRouter.post('/api/categories', async (req, res) => {
    try {
        const { name, image, banner } = req.body;
        const category = new Category({ name, image, banner });
        await category.save();
        res.status(201).send(category);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// READ all categories
categoryRouter.get('/api/categories', async (req, res) => {
    try {
        const categories = await Category.find();
        return res.status(200).json({ categories });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// UPDATE category by ID
categoryRouter.put('/api/categories/:id', async (req, res) => {
    try {
        const { name, image, banner } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, image, banner },
            { new: true }
        );

        if (!updatedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        return res.status(200).send(updatedCategory);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// DELETE category by ID
categoryRouter.delete('/api/categories/:id', async (req, res) => {
    try {
        const deletedCategory = await Category.findByIdAndDelete(req.params.id);

        if (!deletedCategory) {
            return res.status(404).json({ error: 'Category not found' });
        }

        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = categoryRouter;
