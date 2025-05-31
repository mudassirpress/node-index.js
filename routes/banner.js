const express = require('express');
const Banner = require('../models/banner');
const bannerRouter = express.Router();

// CREATE a new banner
bannerRouter.post('/api/banner', async (req, res) => {
    try {
        const { image } = req.body;
        const banner = new Banner({ image });
        await banner.save();
        return res.status(201).send(banner);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// READ all banners
bannerRouter.get('/api/banner', async (req, res) => {
    try {
        const banners = await Banner.find();
        return res.status(200).send(banners);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// UPDATE a banner by ID
bannerRouter.put('/api/banner/:id', async (req, res) => {
    try {
        const { image } = req.body;
        const updatedBanner = await Banner.findByIdAndUpdate(
            req.params.id,
            { image },
            { new: true }
        );

        if (!updatedBanner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        return res.status(200).send(updatedBanner);
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
});

// DELETE a banner by ID
bannerRouter.delete('/api/banner/:id', async (req, res) => {
    try {
        const deletedBanner = await Banner.findByIdAndDelete(req.params.id);

        if (!deletedBanner) {
            return res.status(404).json({ error: 'Banner not found' });
        }

        return res.status(200).json({ message: 'Banner deleted successfully' });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

module.exports = bannerRouter;
