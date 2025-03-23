const express = require('express');
const Doctor = require('../models/doctors');
const doctorRouter = express.Router();

doctorRouter.post('/api/doctor', async (req, res) => {
    try {
        const {
            doctorName,
            description,
            category,
            service,  // Corrected spelling
            images,
        } = req.body;

        const doctor = new Doctor({
            doctorName,
            description,
            category,
            service: service || "", // Default to an empty string if not provided
            images,
        });

        await doctor.save();
        res.status(201).send(doctor);
    } catch (e) {
        console.error(e.message); // Log the error for debugging
        res.status(500).json({ error: e.message });
    }
});
doctorRouter.get('/api/doctor', async (req, res) => {
    try {
        const doctors = await Doctor.find({popular:true}); // Corrected the variable
        if(!doctors || doctors.length == 0){
            return res.status(404).json({message:"doctors not found"});
        } else{
            return res.status(200).json(doctors);
        } // Changed status code to 200 (OK)
    } catch (e) {
        console.error(e.message); // Log the error for debugging
        res.status(500).json({ error: e.message });
    }
});
// new route for retrieving products by category
doctorRouter.get('/api/doctor-by-category/:category',async(req,res)=>{
    try{
      const {category} = req.params;
      const doctors = await Doctor.find({category,popular:true})
      if(!doctors || doctors.length == 0){
        return res.status(404).json({message:"Products not found"});
      }else{
        return res.status(200).json(doctors);
      }
    
    } catch (e){
        res.status(500).json({error:e.message});  
    }
});
// new route for retrieving products by category
doctorRouter.get('/api/doctor-by-service/:service', async (req, res) => {
    try {
        const { service } = req.params;
        const doctors = await Doctor.find({ service, popular: true });

        if (!doctors || doctors.length === 0) {
            return res.status(404).json({ message: "No doctors found for this service" });
        } else {
            return res.status(200).json(doctors);
        }
    } catch (e) {
        console.error(e.message);
        res.status(500).json({ error: e.message });
    }
});
// 📌 Update a doctor's details by ID
doctorRouter.put("/api/doctor/:id", async (req, res) => {
    try {
        const { doctorName, description, category, service, images, popular } = req.body;
        const doctorId = req.params.id;

        const updatedDoctor = await Doctor.findByIdAndUpdate(
            doctorId,
            { doctorName, description, category, service, images, popular },
            { new: true, runValidators: true } // Return the updated document
        );

        if (!updatedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "Doctor updated successfully", doctor: updatedDoctor });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});
// Delete a doctor by ID
doctorRouter.delete('/api/doctor/:id', async (req, res) => {
    try {
        const doctorId = req.params.id;
        const deletedDoctor = await Doctor.findByIdAndDelete(doctorId);

        if (!deletedDoctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        res.status(200).json({ message: "Doctor deleted successfully", doctor: deletedDoctor });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ error: error.message });
    }
});
doctorRouter.get('/api/search-doctors', async (req, res) => {
    try {
        const { query } = req.query;  
        
        console.log("Search query:", query);  // ✅ Debugging log
        
        if (!query) {
            return res.status(400).json({ message: "Query parameter required" });
        }

        const doctors = await Doctor.find({
            $or: [
                { doctorName: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
            ]
        });

        console.log("Doctors found:", doctors.length); // ✅ Debugging log
        
        return res.status(200).json(doctors);

    } catch (e) {
        console.error("Error in search-doctors route:", e.message); // ✅ Log error details
        return res.status(500).json({ error: e.message });
    }
});

module.exports = doctorRouter;
