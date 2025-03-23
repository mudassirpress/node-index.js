const mongoose = require('mongoose');

const doctorSchema = mongoose.Schema({
    doctorName: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    service: {  // Fixed spelling
        type: String,
        required: false,  // Made optional
        default:""
    },
    images: 
        {
            type: String,
            required: true,
        },
    popular: {
        type: Boolean,
        default: true,
    },
    recommend: {
        type: Boolean,
        default: false,
    },
});

// Create and export the model with the correct name
const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
