const mongoose = require("mongoose");

const helpMessageSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: { type: String, required: true },
  message: { type: String, required: true },
  isNew: { type: Boolean, default: true }, // 🟢 New field
  createdAt: { type: Date, default: Date.now },
});

const HelpMessage = mongoose.model("HelpMessage", helpMessageSchema);
module.exports = HelpMessage;
