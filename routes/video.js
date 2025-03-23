const express = require("express");
const Video = require('../models/video');
const videoRouter = express.Router();

// 📌 Add a new video
videoRouter.post("/api/video", async (req, res) => {
    try {
        const { doctorname, title, videoUrl,} = req.body;

        const newVideo = new Video({
            doctorname,
            title,
            videoUrl,
        });

        await newVideo.save();
        res.status(201).json({ message: "Video added successfully", video: newVideo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Get all videos
videoRouter.get("/api/video", async (req, res) => {
    try {
        const videos = await Video.find();
        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Get videos by doctor ID
videoRouter.get("/api/video-doctorId/:doctorname", async (req, res) => {
    try {
        const videos = await Video.find({ doctorname: req.params.doctorname });

        if (!videos.length) {
            return res.status(404).json({ message: "No videos found for this doctor" });
        }

        res.status(200).json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 📌 Update a video by ID
videoRouter.put("/api/video/:id", async (req, res) => {
    try {
        const { doctorname, title, videoUrl } = req.body;
        const videoId = req.params.id;

        const updatedVideo = await Video.findByIdAndUpdate(
            videoId,
            { doctorname, title, videoUrl },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ message: "Video updated successfully", video: updatedVideo });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// 📌 Delete a video by ID
videoRouter.delete("/api/video/:id", async (req, res) => {
    try {
        const videoId = req.params.id;

        const deletedVideo = await Video.findByIdAndDelete(videoId);

        if (!deletedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ message: "Video deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


module.exports = videoRouter;
