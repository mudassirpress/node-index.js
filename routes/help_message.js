const express = require("express");
const helpMessageRouter = express.Router();
const HelpMessage = require("../models/help_message");

// 🟢 Submit Help Message
helpMessageRouter.post("/api/help", async (req, res) => {
  try {
    const { email, name, message } = req.body;

    if (!email || !name || !message) {
      return res.status(400).json({ error: "User ID, name, and message are required" });
    }

    const newMessage = new HelpMessage({ email, name, message });
    await newMessage.save();

    res.status(201).json({ success: true, message: "Help message submitted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});
helpMessageRouter.get("/api/help", async (req, res) => {
  try {
    const messages = await HelpMessage.find(); // Fetch all messages from the database

    if (!messages || messages.length === 0) {
      return res.status(404).json({ error: "No messages found" });
    }

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


helpMessageRouter.get("/api/help/email/:email", async (req, res) => {
  try {
      const { email } = req.params;

      if (!email) {
          return res.status(400).json({ error: "Email is required" });
      }

      // ✅ Convert Email to Case-Insensitive Query
      const messages = await HelpMessage.find({ email: { $regex: new RegExp(`^${email}$`, "i") } });

      console.log("Fetched Messages:", messages); // 🔍 Debug Output

      if (!messages || messages.length === 0) {
          return res.status(404).json({ error: "No messages found for this user" });
      }

      res.status(200).json(messages);
  } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ error: "Internal Server Error" });
  }
});

helpMessageRouter.delete("/api/help/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // ✅ Check if ID is provided
    if (!id) {
      return res.status(400).json({ error: "Message ID is required" });
    }

    // ✅ Attempt to delete the message
    const deletedMessage = await HelpMessage.findByIdAndDelete(id);

    // ✅ Handle message not found
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ success: true, message: "Help message deleted successfully" });
  } catch (error) {
    console.error("Error deleting message:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// Mark a message as read (remove 'New' tag)
helpMessageRouter.patch("/api/help/:id/read", async (req, res) => {
  try {
    const { id } = req.params;

    const updatedMessage = await HelpMessage.findByIdAndUpdate(
      id,
      { isNew: false },
      { new: true }
    );

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.status(200).json({ success: true, message: "Message marked as read", data: updatedMessage });
  } catch (error) {
    console.error("Error marking message as read:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

  
module.exports = helpMessageRouter;
