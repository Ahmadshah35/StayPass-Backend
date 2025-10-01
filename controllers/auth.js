const userFunction = require("../functions/user");
const validationFunction = require("../functions/validation");
const otpFunction = require("../functions/otp");
const emailFunction = require("../functions/email");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user");
require("dotenv").config();

const signUp = async (req, res) => {
    try {
        const validate = await validationFunction.validateUser(req);
        if(validate){
            return res.status(200).json({
                success: true,
                msg: "Email Already taken!"
            })
        } else {
            const user = await userFunction.getUser(req);
            const hash = user.password;
            const password = req.body.password;
            const verify = await validationFunction.verifyPassword(password, hash);
            if(!verify){
                return res.status(200).json({
                    success: false,
                    msg: "Invalid Credentials!"
                })
            } else {
                let token = jwt.sign({

                }, process.env.SECRET_KEY, {expiresIn: "1y"});
                
                const createOTP = await otpFunction.generateOTP(req);
                const userData = {
                    email: req.body.email,
                    OTP: createOTP.OTP
                };
                const sendEmail = await emailFunction.sendOTP(userData); 
                return res.status(200).json({
                    success: true,
                    msg: "OTP Sent Successfully!",
                    data: userData,
                    signupToken: token
                })
            }
        };        
    } catch (error) {
        console.log("Having errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })
    }
};

const verifyOTP = async (req, res) => {
    try {
        const verify = await otpFunction.verifyOTP(req);
        if(!verify){
            return res.status(200).json({
                success: false,
                msg: "Invalid OTP!"
            })
        } else {
            const { signupToken } = req.body;
            const decode = jwt.verify(signupToken, process.env.SECRET_KEY);
            const user = await userFunction.signup(decode);

            let token = jwt.sign({
                id: user._id,
                email: user.email,
                type: user.type 
            }, process.env.SECRET_KEY, { expiresIn: "1y" });
            return res.status(200).json({
                success: true,
                msg: "User is Signed Up Successfully",
                data: {
                    _id: user._id,
                    email: user.email,
                    type: user.type
                }, accessToken: token
            })
        }
    } catch (error) {
        console.log("Having errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })
    }
};

const login = async (req, res) => {
    try {
        const validate = await validationFunction.validateUser(req);
        if(!validate){
            return res.status(200).json({
                success: false,
                msg: "No Account Found"
            })
        } else {
            const user = await userFunction.getUser(req);
            const password = req.body.password;
            const hash = user.password;
            const verify = await validationFunction.verifyPassword(password, hash);
            if(!verify){
                return res.status(200).json({
                    success: false,
                    msg: "Invalid Credentials!"
                })
            } else {
                req.body.userId = user._id;
                const userData = await userFunction.getUserById(req);
                let token = jwt.sign({

                }, process.env.SECRET_KEY, { expiresIn: "1y"});

                return res.status(200).json({
                    success: true,
                    msg: "User Successfully Logged-In!",
                    data: userData,
                    accessToken: token
                })
            }
        }
    } catch (error) {
        console.log("Having errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        }) 
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await userFunction.getUserById(req);
        if(!user){
            return res.status(200).json({
                success: false,
                msg: "No Profile Found By Id!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Profile Details!",
                data: user
            })
        }
    } catch (error) {
        console.log("Having errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })       
    }
};

const updateUser = async (req, res) => {
    try {
        const user = await userFunction.updateUser(req);
        if(!user){
            return res.status(200).json({
                success: false,
                msg: "No Profile Found to Update!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Profile Updated Successfully!",
                data: user
            })
        }
    } catch (error) {
        console.log("Having errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await userFunction.getAllUsers(req);
        if(users.length === 0){
            return res.status(200).json({
                success: false,
                msg: "No Accounts Found!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "All Users",
                data: users
            })
        }
    } catch (error) {
        console.log("Having errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await userFunction.deleteUser(req);
        if(!user){
            return res.status(200).json({
                success: false,
                msg: "No Account Found to Delete!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Accound is Deleted!"
            })
        }
    } catch (error) {
         console.log("Having errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })       
    }
};

const forgetPassword = async (req, res) => {
    try {
        const user = await userFunction.getUser(req);
        if(!user){
            return res.status(200).json({
                success: false,
                msg: "No Account Found!"
            })
        } else {
            const createOTP = await otpFunction.generateOTP(req);
            const userData = {
                email: createOTP.email,
                OTP: createOTP.OTP,
                type: user.type
            };
            const sendMail = await emailFunction.sendOTP(userData);
            return res.status(200).json({
                success: true,
                msg: "OTP Sent Successfully!",
                data: userData
            })
        }
    } catch (error) {
        console.log("Having errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const verifOTPForPassword = async (req, res) => {
    try {
        const verify = await otpFunction.verifyOTP(req);
        if(!verify){
            return res.status(200).json({
                success: false,
                msg: "Invalid OTP",
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "OTP Verified Successfully!",
            })
        }
    } catch (error) {
        console.log("Having errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

const resetPassword = async (req, res) => {
    try {
        const user = await userFunction.resetPassword(req);
        if(!user){
            return res.status(200).json({
                success: false,
                msg: "Password is Not Updated!"
            })
        } else {
            return res.status(200).json({
                success: true,
                msg: "Password is Updated!"
            })
        }
    } catch (error) {
        console.log("Having errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })       
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
        if(!verify){
            return res.status(200).json({
                success: false,
                msg: "Incorrect Password!"
            })
        } else {
            const reset = await userFunction.resetPassword(req);
            return res.status(200).json({
                success: true,
                msg: "Password Successfully Changed!"
            })
        }
    } catch (error) {
        console.log("Having errors :", error);
        return res.status(400).json({
            success: false,
            msg: "Something Went Wrong!",
            error: error.message
        })        
    }
};

module.exports = {
    signUp,
    verifyOTP,
    login,
    getUserProfile,
    getAllUsers,
    updateUser,
    deleteUser,
    forgetPassword,
    verifOTPForPassword,
    resetPassword,
    changePassword
};