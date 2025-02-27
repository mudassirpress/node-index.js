const express = require('express');
const SubCategory = require('../models/subcategory');
const subCategoryRouter = express.Router();

// Create a new subcategory
subCategoryRouter.post('/api/subcategories', async (req, res) => {
  try {
    const { categoryId, categoryName, image, subCategoryName } = req.body;
    const subCategory = new SubCategory({ categoryId, categoryName, image, subCategoryName });
    await subCategory.save();
    res.status(201).send(subCategory);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get all subcategories
subCategoryRouter.get('/api/subcategories', async (req, res) => {
  try {
    const subcategories = await SubCategory.find();
    return res.status(200).json({subcategories}); // Return a plain array
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Get subcategories by category name
subCategoryRouter.get('/api/categories/:categoryName/subcategories', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const subcategories = await SubCategory.find({ categoryName: categoryName });
    if (!subcategories || subcategories.length == 0) {
      return res.status(404).json({ message: 'No subcategories found' });
    }
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = subCategoryRouter;
