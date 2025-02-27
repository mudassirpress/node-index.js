const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');

authRouter.post('/api/signup', async(req,res)=>{
    try{
        const {fullname, email, password} = req.body;
     const existingemail =  await User.findOne({email});
     if(existingemail){
        return res.status(400).json({
            message:"user with same email already esist"
        });    
     }else{
        // Generate a salt with a cost factor of 10
        const salt = await bcrypt.genSalt(10);
        // hash the password using the generated salt
        const hashPassword = await bcrypt.hash(password,salt);
     let user = new User({fullname, email, password:hashPassword});
     user = await user.save();
     res.json({user});
     }
    } catch (e){
        res.status(500).json({error:e.message});
    }
});

// Sign in api Endpoint

authRouter.post('/api/signin', async(req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await User.findOne({email});
        if (!findUser) {
            return res.status(400).json({
                message: "User not found with this email"
            });
        } else {
            const isMatch = await bcrypt.compare(password, findUser.password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Incorrect password"
                });
            } else {
                const token = jwt.sign({ id: findUser._id }, "passwordKey");
                // Remove sensitive information
                const { password, ...userWithoutPassword } = findUser._doc;

                // Send the response
                res.json({ token ,user:userWithoutPassword });
            }
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// authRouter.put('/api/users/:id',async(req,res)=>{
//     try{
//         const {id} = req.params;
//         const {state, city, locality} = req.body;
//         const updatedUser = await User.findByIdAndUpdate(
//             id,
//             {
//                 state,
//                 city,
//                 locality,
//             },
//             {
//                 new:true,
//             }
//         );
//         if(!updatedUser){
//             return res.status(404).json({error:"User not found"});
//         }
//         return res.status(200).json(updatedUser);
//     } catch (e){
//         res.status(500).json({ error: e.message });
//     }
// });
authRouter.put('/api/users/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const { state, city, locality } = req.body;
        if (!state || !city || !locality) {
            return res.status(400).json({ error: "All fields are required (state, city, locality)" });
        }

        // Ensure valid MongoDB ObjectId
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).json({ error: "Invalid User ID format" });
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { state, city, locality },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(updatedUser);

    } catch (error) {
        console.error("Error updating user:", error); // Logs full error in server
        return res.status(500).json({ error: "Unknown error occurred" });
    }
});

authRouter.get('/api/users',async(req,res)=>{
    try{
        const users = await User.find().select('-password');
        return res.status(200).json(users);

    } catch (e){
        res.status(500).json({error:e.message});
    }
});

module.exports= authRouter;