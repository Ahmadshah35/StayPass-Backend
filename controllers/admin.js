const adminFunction = require("../functions/admin");
const validation = require("../functions/validation");
const otpFunction = require("../functions/otp");
const emailFunction = require("../functions/email");

const signup = async (req, res) => {
  try {
    const validate = await validation.validateAdmin(req);
    if (validate) {
      return res.status(400).json({ success: false, message: "Email Already Taken!" });
    } else {
      const admin = await adminFunction.signup(req);
      return res.status(200).json({success: true,message: "Admin Signed-Up  Successfully!",data: admin,});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const login = async (req, res) => {
  try {
    const validate = await validation.validateAdmin(req);
    if (!validate) {
      return res.status(400).json({success: false,message: "No Acoount Found!",});
    } else {
      const admin = await adminFunction.getAdmin(req);
      const hash = admin.password;
      const password = req.body.password;
      const verify = await validation.verifyPassword(password, hash);
      if (!verify) {
        return res.status(400).json({success: false,message: "Invalid Credentials!",});
      } else {
        req.body.adminId = admin._id;
        const admindata = await adminFunction.getAdmiById(req);
        return res.status(200).json({success: true,message: "Admin Logged-In Successfully!",data: admindata,});
      }
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const getAdmiById = async (req, res) => {
  try {
    const admin = await adminFunction.getAdmiById(req);
    if (!admin) {
      return res.status(200).json(400).json({success: false,message: "No Admin Details Found!",});
    } else {
      return res.status(200).json(200).json({success: true,message: "Admin Details By Id!",data: admin,});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const updateAdmin = async (req, res) => {
  try {
    const admin = await adminFunction.updateAdmin(req);
    if (!admin) {
      return res.status(400).json({success: false,message: "No Admin Profile Found to be Updated!",});
    } else {
      return res.status(200).json({success: true,message: "Admin Profile Updated Successfully!",data: admin,});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const forgetPassword = async (req, res) => {
  try {
    const admin = await adminFunction.getAdmin(req);
    if (!admin) {
      return res.status(400).json({success: false,message: "No Admin Account Found!",});
    } else {
      const otp = Math.floor(1000 + Math.random() * 9000).toString();
      const otpExist = await  otpFunction.resendOtp(req.body.email);
      if(otpExist){
        otpExist.OTP = otp
        otpExist.save();
      }else{
        await otpFunction.generateOTP(req.body.email,otp);
      }
      const userData = {
        email: req.body.email,
        OTP: otp,
      };
      const sendEmail = await emailFunction.sendOTP(userData);
      if(!sendEmail) return res.status(400).json({success:false,message:"Otp not sent"});
      return res.status(200).json({success: true,message: "OTP is Successfully!",data: userData,});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const resetPassword = async (req, res) => {
  try {
    const admin = await adminFunction.resetPassword(req);
    if (!admin) {
      return res.status(400).json({success: false,message: "No Admin Found!",});
    } else {
      return res.status(200).json({success: true,message: "Admin Password Reset Successfully!",});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const changePassword = async (req, res) => {
  try {
    const admin = await adminFunction.getAdmin(req);
    req.body.adminId = admin._id;
    const adminData = await adminFunction.getAdmiById(req);
    const hash = adminData.password;
    const password = req.body.oldPassword;
    const verify = await validation.verifyPassword(password, hash);
    if (!verify) {
      return res.status(400).json({success: false,message: "invalid Password!",});
    } else {
      const reset = await adminFunction.resetPassword(req);
      return res.status(200).json({success: true,message: "Password is Successfully Changed!",});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

module.exports = {
  signup,
  login,
  getAdmiById,
  updateAdmin,
  forgetPassword,
  resetPassword,
  changePassword,
};
