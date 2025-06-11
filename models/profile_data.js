const mongoose = require("mongoose");

const profileDataSchema = mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                const result = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return result.test(value);
            },
            message: "Please enter a valid email address",
        },
    },
    state: {
        type: String,
        default: "",
        trim: true,
    },
    city: {
        type: String,
        default: "",
        trim: true,
    },
    locality: {
        type: String,
        default: "",
        trim: true,
    },
    gender: {
        type: String,
        enum: ["Male", "Female", "Other"],
        default: "Other",
    },
    phone: {
        type: String,
        default: "",
        trim: true,
    },
    profileImage: {
        type: String,
        default: "",  // you can store image URL or path here
    },
    birthday: {
        type: Date, // <-- added birthday field
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});

const Profile = mongoose.model("Profile", profileDataSchema);

module.exports = Profile;
