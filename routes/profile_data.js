const express = require("express");
const profileRouter = express.Router();
const Profile = require("../models/profile_data");  // import your model

// POST create profile
profileRouter.post("/api/profile", async (req, res) => {
    const { email, state, city, locality, gender, phone, profileImage, birthday } = req.body;

    try {
        // check if email already exists
        const existingProfile = await Profile.findOne({ email });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile with this email already exists" });
        }

        const profile = new Profile({
            email,
            state,
            city,
            locality,
            gender,
            phone,
            profileImage,
            birthday
        });

        const savedProfile = await profile.save();
        res.status(201).json({ message: "Profile created successfully", profile: savedProfile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
profileRouter.get("/api/profile/:email", async (req, res) => {
    const email = req.params.email;

    try {
        const profile = await Profile.findOne({ email: email });

        if (!profile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json(profile);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// PUT edit profile by email
profileRouter.put("/api/profile/:email", async (req, res) => {
    const email = req.params.email;

    try {
        const updatedProfile = await Profile.findOneAndUpdate(
            { email: email },  // filter by email
            {
                $set: req.body  // update fields from body
            },
            { new: true }  // return updated document
        );

        if (!updatedProfile) {
            return res.status(404).json({ message: "Profile not found" });
        }

        res.json({ message: "Profile updated successfully", profile: updatedProfile });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
module.exports = profileRouter;