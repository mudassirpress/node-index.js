// const express = require('express');
// const bcrypt = require('bcryptjs');
// const Vendor = require('../models/vendor');
// const VendorRouter = express.Router();
// const jwt = require('jsonwebtoken');

// VendorRouter.post('/api/vendor/signup', async(req,res)=>{
//     try{
//         const {fullname, email, password} = req.body;
//      const existingemail =  await Vendor.findOne({email});
//      if(existingemail){
//         return res.status(400).json({
//             message:"vendor with same email already esist"
//         });    
//      }else{
//         // Generate a salt with a cost factor of 10
//         const salt = await bcrypt.genSalt(10);
//         // hash the password using the generated salt
//         const hashPassword = await bcrypt.hash(password,salt);
//      let vendor = new Vendor({fullname, email, password:hashPassword});
//      vendors = await vendor.save();
//      res.json({vendors});
//      }
//     } catch (e){
//         res.status(500).json({error:e.message});
//     }
// });

// // Sign in api Endpoint

// VendorRouter.post('/api/vendor/signin', async(req, res) => {
//     try {
//         const { email, password } = req.body;
//         const findvendor = await Vendor.findOne({email});
//         if (!findvendor) {
//             return res.status(400).json({
//                 message: "Vendor not found with this email"
//             });
//         } else {
//             const isMatch = await bcrypt.compare(password, findvendor.password);
//             if (!isMatch) {
//                 return res.status(400).json({
//                     message: "Incorrect password"
//                 });
//             } else {
//                 const token = jwt.sign({ id: findvendor._id }, "passwordKey");
//                 // Remove sensitive information
//                 const { password, ...vendorWithoutPassword } = findvendor._doc;

//                 // Send the response
//                 res.json({token ,vendor:vendorWithoutPassword});
//             }
//         }
//     } catch (e) {
//         res.status(500).json({ error: e.message });
//     }
// });

// module.exports= VendorRouter;
const express = require('express');
const bcrypt = require('bcryptjs');
const vendor = require('../models/vendor');
const VendorRouter = express.Router();
const jwt = require('jsonwebtoken');

VendorRouter.post('/api/vendor/signup', async(req,res)=>{
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
     let vendors = new vendor({fullname, email, password:hashPassword});
      vendors = await vendors.save();
     res.json({vendors});
     }
    } catch (e){
        res.status(500).json({error:e.message});
    }
});

// Sign in api Endpoint

VendorRouter.post('/api/vendor/signin', async(req, res) => {
    try {
        const { email, password } = req.body;
        const findUser = await vendor.findOne({email});
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
                res.json({ token,vendor:userWithoutPassword });
            }
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

VendorRouter.get('/api/vendor',async(req,res)=>{
    try{
        const vendors = await vendor.find().select('-password');
        return res.status(200).json(vendors);

    } catch (e){
        res.status(500).json({error:e.message});
    }
});
module.exports= VendorRouter;