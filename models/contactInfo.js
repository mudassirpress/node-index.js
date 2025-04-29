const mongoose = require('mongoose');

const workingHoursSchema = new mongoose.Schema({
  location: {
    type: String,
    required: true
  },
  SUN_MON: {
    type: String,
    required: true
  },
  TUE_THU: {
    type: String,
    required: true
  },
  FRI_SAT: {
    type: String,
    required: true
  },
  appointmentPhone: {
    type: String,
    required: true
  }
});

const ContactInfo = mongoose.model('ContactInfo', workingHoursSchema);

module.exports = ContactInfo;
