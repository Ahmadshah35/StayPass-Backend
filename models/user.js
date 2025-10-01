const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    type: {
        type: String,
        enum: ["user", "vendor"],
        requried: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profileImage: {
        type: String
    },
    name: {
        type: String,
    },
    phone: {
        type: String
    },
    DOB:{
        type: String
    },
    city:{
        type: String
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    },
    locationName: {
        type: String
    },
    location: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number]
        },
        locationName: {
            type: String
        }
    },
});

userSchema.index({ location: "2dsphere" });

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;