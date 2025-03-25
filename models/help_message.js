const mongoose = require("mongoose");

const helpMessageSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true 
   }, // Reference to User
   name: { 
    type: String, 
    required: true 
}, // User's Name
  message: { 
    type: String, 
    required: true 
},
  createdAt: { 
    type: Date, 
    default: Date.now
},
});

const HelpMessage = mongoose.model("HelpMessage", helpMessageSchema);
module.exports = HelpMessage;
