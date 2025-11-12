const OTPModel = require("../models/otpModel");

const generateOTP = async (email,otp) => {
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

const verifyOTPForSignUp = async (email,OTP) => {
    const otp = await OTPModel.findOne({email, OTP});
    return otp 
};

const deleteOtp = async (email) => {
  const user = await OTPModel.deleteMany({email:email});
  return user;
}; 

const resendOtp = async (email) => {
  await email.toLowerCase();
  const resend = await OTPModel.findOne({ email: email });

  return resend;
};


module.exports = {
    generateOTP,
    verifyOTP,
    deleteOtp,
    resendOtp,
    verifyOTPForSignUp
};