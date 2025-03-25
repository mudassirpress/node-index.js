const mongoose = require("mongoose");

const EmailMessageSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    doctorname: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true
    },
    createdAt: { 
      type: Date, 
      default: Date.now
  },
  },
);

module.exports = mongoose.model("EmailMessage", EmailMessageSchema);
