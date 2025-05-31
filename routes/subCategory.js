const express = require('express');
const SubCategory = require('../models/subcategory');
const subCategoryRouter = express.Router();

// CREATE a new subcategory
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

// READ all subcategories
subCategoryRouter.get('/api/subcategories', async (req, res) => {
  try {
    const subcategories = await SubCategory.find();
    return res.status(200).json({ subcategories });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// READ subcategories by category name
subCategoryRouter.get('/api/categories/:categoryName/subcategories', async (req, res) => {
  try {
    const { categoryName } = req.params;
    const subcategories = await SubCategory.find({ categoryName });
    if (!subcategories || subcategories.length === 0) {
      return res.status(404).json({ message: 'No subcategories found' });
    }
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// UPDATE subcategory by ID
subCategoryRouter.put('/api/subcategories/:id', async (req, res) => {
  try {
    const { categoryId, categoryName, image, subCategoryName } = req.body;
    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { categoryId, categoryName, image, subCategoryName },
      { new: true }
    );

    if (!updatedSubCategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    return res.status(200).json(updatedSubCategory);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// DELETE subcategory by ID
subCategoryRouter.delete('/api/subcategories/:id', async (req, res) => {
  try {
    const deletedSubCategory = await SubCategory.findByIdAndDelete(req.params.id);

    if (!deletedSubCategory) {
      return res.status(404).json({ error: 'Subcategory not found' });
    }

    return res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = subCategoryRouter;
