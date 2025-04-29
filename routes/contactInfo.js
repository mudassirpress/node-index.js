const express = require('express');
const contactInfoRouter = express.Router();
const ContactInfo = require('../models/contactInfo'); // Adjust the path if needed

// Create or Update Contact Info (single entry)
contactInfoRouter.post('/api/contactInfo', async (req, res) => {
  try {
    const { location, SUN_MON, TUE_THU, FRI_SAT, appointmentPhone } = req.body;

    const contactInfo = await ContactInfo.findOneAndUpdate(
      {}, // No filter = apply to the first or only doc
      {
        location,
        SUN_MON,
        TUE_THU,
        FRI_SAT,
        appointmentPhone
      },
      { upsert: true, new: true } // Create if not exists, return new doc
    );

    res.status(200).json({ message: 'Contact info saved successfully', contactInfo });
  } catch (error) {
    console.error('Error saving contact info:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get Contact Info
contactInfoRouter.get('/api/contactInfo', async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
      return res.status(404).json({ message: 'No contact info found' });
    }

    res.status(200).json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = contactInfoRouter;
