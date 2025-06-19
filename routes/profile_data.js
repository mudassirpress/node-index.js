const express = require("express");
const profileRouter = express.Router();
const Profile = require("../models/profile_data");  // import your model
const {auth,vendorAuth} = require('../middleware/auth');

// POST create profile
profileRouter.post("/api/profile", async (req, res) => {
    const { email, state, city, locality, gender, phone, profileImage, birthday, createdAt } = req.body;

    try {
        // First check if email exists in DB
        const existingProfile = await Profile.findOne({ email });

        if (existingProfile) {
            return res.status(400).json({ success: false, message: "Profile with this email already exists" });
        }

        // Create new profile if not exists
        const profile = new Profile({
            email,
            state,
            city,
            locality,
            gender,
            phone,
            profileImage,
            birthday,
            createdAt: createdAt || new Date()  // default current time if not sent
        });

        const savedProfile = await profile.save();

        return res.status(201).json({
            success: true,
            message: "Profile created successfully",
            profile: savedProfile
        });
    } catch (error) {
        console.error("Error creating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Server error, please try again later"
        });
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
productRouter.put('/api/edit-profile/:profileId',auth,vendorAuth,async(req,res)=>{
    try{
        const {id} = req.params;
        const profile = await Profile.findById(id);
        if(!profile){
            return res.status(404).json({message:"No Product found "}); 
        }
        if(profile.vendorId.toString() !== req.user.id){
            return res.status(403).json({message:"Unauthorzied to edit this Product"}); 
        }
        const {vendorId, ...updateData} = req.body;
        const updateProfile= await Profile.findByIdAndUpdate(
            id,
            {$set:updateData},
            {new:true}
        );
        return res.status(200).json(updateProfile);
    } catch (e) {
        return res.status(500).json({error:e.message});
    }
});
profileRouter.delete('/api/profile/:id',auth,vendorAuth,async(req,res)=>{
    try{
        const {id} = req.params;
        const profileDelete = await Profile.findByIdAndDelete(id); 
        if(!profileDelete){
            return res.status(404).json({message:"No Profile found"});
        } else {
            return res.status(200).json({ message: "Profile was deleted successfully" });
        }
    } catch (e) {
        return res.status(500).json({error:e.message});
    }
});
module.exports = profileRouter;