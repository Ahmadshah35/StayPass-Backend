const OTPModel = require("../models/otpModel");

const generateOTP = async (req) => {
    const { email } = req.body;
    const otp = Math.floor(1000000 + Math.random() * 9000000).toString();
    const newOTP = new OTPModel({
        email,
        OTP: otp
    });
    const result = await newOTP.save();
    return result
};

const verifyOTP = async (req) => {
    const { email, OTP } = req.query;
    const otp = await OTPModel.findOne(email, OTP);
    return otp 
};

module.exports = {
    generateOTP,
    verifyOTP
};