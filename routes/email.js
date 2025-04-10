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
emailRouter.get("/api/email/:email", async (req, res) => {
  const { email } = req.params;

  try {
    // 🔹 Find messages by email field
    const messages = await EmailMessage.find({ email });

    if (!messages.length) {
      return res.status(404).json({ error: "No messages found for this email." });
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages." });
  }
});
// 📌 DELETE: Remove an email message by ID
emailRouter.delete("/api/email/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMessage = await EmailMessage.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found." });
    }

    res.status(200).json({ success: "Message deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message." });
  }
});

  
module.exports = emailRouter;
