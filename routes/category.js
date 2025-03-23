const express = require('express');
const Category = require('../models/category');
const categoryRouter = express.Router();

//  Create a new category
categoryRouter.post('/api/category', async (req, res) => {
  try {
    const { name, image, } = req.body;
    const category = new Category({ name, image, });
    await category.save();
    res.status(201).json(category);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//  Get all category (Fixed response format)
categoryRouter.get('/api/category', async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json({categories});  // Wrap response in object
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});
//  Update a category by ID
categoryRouter.put('/api/category/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, image }, 
      { new: true, runValidators: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (e) {
    console.log(" Update Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});
categoryRouter.get('/api/search-category', async (req, res) => {
    try {
        const { query } = req.query;  
        if (!query) {
            return res.status(400).json({ message: "Query parameter required" });
        }
        const category = await Category.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
            ]
        });        
        return res.status(200).json(category);

    } catch (e) {
        console.error("Error in search-doctors route:", e.message); 
        return res.status(500).json({ error: e.message });
    }
});


module.exports = categoryRouter;
