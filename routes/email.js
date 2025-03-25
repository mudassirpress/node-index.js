const express = require("express");
const EmailMessage = require("../models/email"); // Import Model

const emailRouter = express.Router();

// 📌 POST: Save Email Message to Database
emailRouter.post("/api/email/send", async (req, res) => {
  const { email,doctorname, subject, message } = req.body;

  // ✅ Validate required fields
  if (!email || !doctorname || !subject || !message) {
    return res.status(400).json({ error: "Email, subject, and message are required." });
  }

  try {
    // 🔹 Save to MongoDB
    const emailMessage = new EmailMessage({ email, doctorname, subject, message });
    await emailMessage.save();

    res.status(201).json({ success: "Message saved successfully!", data: emailMessage });
  } catch (error) {
    res.status(500).json({ error: "Failed to save message." });
  }
});
emailRouter.get("/api/email", async (req, res) => {
  try {
    const emails = await EmailMessage.find(); // 🔹 Get all emails, sorted by latest
    res.status(200).json(emails);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch email messages." });
  }
});
emailRouter.get("/api/email/:id", async (req, res) => {
    const { id } = req.params;
  
    try {
      // 🔹 Find message by ID
      const message = await EmailMessage.findById(id);
  
      if (!message) {
        return res.status(404).json({ error: "Message not found." });
      }
  
      res.status(200).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch the message." });
    }
  });
  
module.exports = emailRouter;
