const userFunction = require("../functions/user");
const validationFunction = require("../functions/validation");
const otpFunction = require("../functions/otp");
const emailFunction = require("../functions/email");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signUpOrLoginAdminByGoogle = async (req, res) => {
  try {
    const validate = await validationFunction.validateUser(req);
    if (validate) {
      if(validate.isDeleted == true) return res.status(200).json({message: "Account is Deleted cannot Login",success: false});
      if(req.body.loginFromApp == true && validate.type == "Vendor") return res.status(400).json({success:false,message:"Account not found!"})
      const token = jwt.sign({ _id: validate._id, email: validate.email,type:validate.type},process.env.SECRET_KEY,{ expiresIn: "5y" });
      const userWithoutPassword = await userFunction.getUserProfileById(validate._id);
      return res.status(200).json({message: "Logged In successfully",success: true,data: userWithoutPassword,token: token,});
    } else {
      const signUp = await userFunction.signUpUserByGoogle(req);
      if (!signUp) return res.status(400).json({ message: "SignUp failed", success: false });
      if(req.body.loginFromApp == true && signUp.type == "Vendor") return res.status(400).json({success:false,message:"Account not found!"})
    
      const userWithoutPassword = await userFunction.getUserProfileById(signUp._id);
      const token = jwt.sign({ _id: userWithoutPassword._id, email: userWithoutPassword.email ,type:userWithoutPassword.type},process.env.SECRET_KEY,{ expiresIn: "5y" });

      return res.status(200).json({message: "SignUp successfully",success: true,data: userWithoutPassword,token: token,});
    }
  } catch (error) {
    console.error("error :", error);
    return res.status(400).json({message: "Something went wrong",success: false,error: error.message });
  }
};


const signUp = async (req, res) => {
  try {
    const validate = await validationFunction.validateUser(req);
    if (validate) return res.status(400).json({success: false,message: "Email Already taken!",});
      
    let token = jwt.sign(req.body, process.env.SECRET_KEY, { expiresIn: "1d" });
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
    return res.status(200).json({success: true,message: "OTP Sent Successfully!",data: userData,signupToken: token,});
      
    
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const VerifyOtpAndCreate = async (req, res) => {
  try {
    const { signupToken ,OTP } = req.body;
    const decode = jwt.verify(signupToken, process.env.SECRET_KEY);
    console.log("first",decode)
    const verify = await otpFunction.verifyOTPForSignUp(decode.email,OTP);
    if (!verify) return res.status(400).json({success: false,message: "Invalid OTP!",});
    const user = await userFunction.signup(decode);
    if(!user) return res.status(400).json({success:false, message:"SignUp failed"});
    const getUser = await userFunction.getUserProfile(decode.email)
    let token = jwt.sign({ _id: user._id, email: user.email, type: user.type,},process.env.SECRET_KEY,{ expiresIn: "1y" });
    await otpFunction.deleteOtp(user.email);
    return res.status(200).json({success: true,message: "Signed Up Successfully",data:getUser ,accessToken: token,});
    
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const login = async (req, res) => {
  try {
    const validate = await validationFunction.validateUser(req);
    if (!validate) {
      return res.status(400).json({success: false,message: "No Account Found",});
    } else {
      if(req.body.loginFromApp == true && validate.type == "Vendor") return res.status(400).json({success:false,message:"Account not found!"})
      const user = await userFunction.getUser(req);
      if(user.isDeleted == true) return res.status(200).json({success:true,message:"Account is Deleted cannot Login"})
      const password = req.body.password;
      const hash = user.password;
      const verify = await validationFunction.verifyPassword(password, hash);
      if (!verify) {
        return res.status(400).json({success: false,message: "Invalid Credentials!",});
      } else {
        req.body.userId = user._id;
        const userData = await userFunction.getUserById(req);
        let token = jwt.sign({_id:user._id,email:user.email,type:user.type}, process.env.SECRET_KEY, { expiresIn: "1y" });

        return res.status(200).json({success: true,message: "User Successfully Logged-In!",data: userData,accessToken: token,});
      }
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await userFunction.getUserById(req);
    if (!user) {
      return res.status(400).json({success: false,message: "No Profile Found By Id!",});
    } else {
      return res.status(200).json({success: true,message: "Profile Details!",data: user,});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userFunction.updateUser(req);
    if (!user) {
      return res.status(400).json({success: false,message: "No Profile Found to Update!",});
    } else {
      return res.status(200).json({success: true,message: "Profile Updated Successfully!",data: user,});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userFunction.getAllUsers(req);
    if (users.length === 0) {
      return res.status(400).json({success: false,message: "No Accounts Found!",});
    } else {
      return res.status(200).json({success: true,message: "All Users",data: users,});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await userFunction.deleteUser(req);
    if (!user) {
      return res.status(400).json({success: false,message: "No Account Found to Delete!",});
    } else {
      return res.status(200).json({success: true,message: "Accound is Deleted!",});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const forgetPassword = async (req, res) => {
  try {
    const user = await userFunction.getUser(req);
    if (!user) {
      return res.status(400).json({success: false,message: "No Account Found!",});
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
        type: user.type,
      };
      const sendMail = await emailFunction.sendOTP(userData);
      if(!sendMail) return res.status(400).json({success:false,message:"Otp not sent"});
      return res.status(200).json({success: true,message: "OTP Sent Successfully!",data: userData,});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const verifyOtp = async (req, res) => {
  try {
    const verify = await otpFunction.verifyOTP(req);
    if (!verify) {
      return res.status(400).json({success: false,message: "Invalid OTP",});
    } else {
      await otpFunction.deleteOtp(req.body.email)
      return res.status(200).json({success: true,message: "OTP Verified Successfully!",});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const resetPassword = async (req, res) => {
  try {
    const user = await userFunction.resetPassword(req);
    if (!user) {
      return res.status(400).json({success: false,message: "Password is Not Updated!",});
    } else {
      return res.status(200).json({success: true,message: "Password is Updated!",});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const changePassword = async (req, res) => {
  try {
    const user = await userFunction.getUserById(req);
    req.body.email = user.email;
    const userData = await userFunction.getUser(req);
    const hash = userData.password;
    const password = req.body.oldPassword;
    const verify = await validationFunction.verifyPassword(password, hash);
    if (!verify) {
      return res.status(400).json({success: false,message: "Incorrect Password!",});
    } else {
      const reset = await userFunction.resetPassword(req);
      return res.status(200).json({success: true,message: "Password Successfully Changed!",});
    }
  } catch (error) {
    console.log("Having errors :", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

module.exports = {
  signUpOrLoginAdminByGoogle,
  signUp,
  VerifyOtpAndCreate,
  login,
  getUserProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  forgetPassword,
  verifyOtp,
  resetPassword,
  changePassword,
};