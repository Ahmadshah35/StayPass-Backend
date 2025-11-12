const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const otpSchema = new Schema({
  email: {
    type: String,
    lowercase:true,
    required: true,
  },
  OTP: {
    type: Number,
    required: true,
  },
},{timestamps:true});

const OTPModel = mongoose.model("OTP", otpSchema);
module.exports = OTPModel;
