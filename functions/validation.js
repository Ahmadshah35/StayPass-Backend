const userModel = require("../models/user");
const adminModel = require("../models/admin");
const bcrypt = require("bcrypt");

const validateUser = async (req) => {
    const { email } = req.body;
    const exists = await userModel.findOne({email: email});
    return exists
};

const validateAdmin = async (req) => {
    const { email } = req.body;
    const exists = await adminModel.findOne({email: email});
    if(!exists){
        return false
    } else {
        return true
    }
};

const verifyPassword = async (password, hash) => {
    const match = await bcrypt.compare(password, hash);
    console.log("Testing :", match);
    return match
};

module.exports = {
    validateUser,
    validateAdmin,
    verifyPassword
};