const userModel = require("../models/user");
const bcrypt = require('bcrypt');

const signup = async (req) => {
    const newUser = new userModel(req.body);
    const hash = await bcrypt.hash(req.body.password, 10);
    const imagePath = req.file.filename;
    newUser.profileImage = imagePath;
    newUser.password = hash;
    const result = await newUser.save();
    return result
};

const getUser = async (req) => {
    const user = await userModel.findOne({email: req.body.email});
    return user
};

const getUserById = async (req) => {
    const userId  = req.query.userId || req.body.userId;
    const user = await userModel.findById(userId).select("-password");
    return user  
};

const updateUser = async (req) => {
    const { userId } = req.body;
    const updateData = req.body;

    const user = await userModel.findByIdAndUpdate(userId, 
        { $set: updateData },
        { new: true }
    ). select("-password");
    return user
};

const getAllUsers = async (req) => {
    const { type } = req.query;
    const filter = {};
    if(type){
        filter.type = type;
    }
    const users = await userModel.find(filter).select("-password");
    return users
};

const deleteUser = async (req) => {
    const { userId } = req.body;
    const user = await userModel.findByIdAndDelete(userId);
    return user
};

const resetPassword = async (req) => {
    const { userId, newPassword } = req.body;
    const hash = await bcrypt.hash(newPassword, 10);
    const user = await userModel.findByIdAndUpdate(userId, 
        { $set: { password: hash }},
        { new: true}
    );
    return user
};

const updateRatingInProperty = async (rating) => {
    // const {property, }
};

module.exports = {
    signup,
    getUser,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    resetPassword
};