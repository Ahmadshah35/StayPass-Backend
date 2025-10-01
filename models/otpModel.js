const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    OTP: {
        type: Number,
        required: true
    },
    createAt:{
        type: Date,
        default: Date.now,
        expiresIn: "600"
    }
});

const OTPModel = mongoose.model("OTP", otpSchema);
module.exports = OTPModel;