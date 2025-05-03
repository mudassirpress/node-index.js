const express = require('express');
const Servise = require('../models/servise');
const serviseRouter = express.Router();

// ✅ Create a new service
serviseRouter.post('/api/servise', async (req, res) => {
  try {
    const { name, image } = req.body;
    if (!name || !image) {
      return res.status(400).json({ error: "Name and image are required" });
    }

    const servise = new Servise({ name, image });
    await servise.save();
    res.status(201).json(servise);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ✅ Get all services
serviseRouter.get('/api/servise', async (req, res) => {
  try {
    const servises = await Servise.find();
    res.status(200).json({ servises }); // ✅ Wrap response in object
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

//  Update a service by ID
serviseRouter.put('/api/servise/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, image } = req.body;
    const updatedService = await Servise.findByIdAndUpdate(
      id,
      { name, image }, 
      { new: true, runValidators: true }
    );
    if (!updatedService) {
      return res.status(404).json({ error: "Service not found" });
    }
    res.status(200).json(updatedService);
  } catch (e) {
    console.log(" Update Error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// ✅ Delete a service by ID
serviseRouter.delete('/api/servise/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedService = await Servise.findByIdAndDelete(id);

    if (!deletedService) {
      return res.status(404).json({ error: "Service not found" });
    }

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = serviseRouter;
