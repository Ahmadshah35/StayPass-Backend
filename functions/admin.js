const adminModel = require("../models/admin");
const bcrypt = require("bcrypt");

const signup = async (req) => {
    const newAdmin = new adminModel(req.body);
    const hash = await bcrypt.hash(req.body.password, 10);
    newAdmin.password = hash;
    const result = await newAdmin.save();
    return result;
};

const getAdmin = async (req) => {
    const { email } = req.body;
    const admin = await adminModel.findOne({ email: email });
    return admin
};

const getAdmiById = async (req) => {
    const adminId = req.query.adminId || req.body.adminId;
    const admin = await adminModel.findById(adminId);
    return admin
};

const updateAdmin = async (req) => {
    const { adminId } = req.body;
    const updatedData = req.body;

    const admin = await adminModel.findByIdAndUpdate(adminId, 
        { $set: updatedData },
        { new: true }
    );
    return admin
};

const resetPassword = async (req) => {
    const { adminId, oldPassword } = req.body;
    const hash = await bcrypt.hash(oldPassword, 10);
    const admin = await adminModel.findByIdAndUpdate(adminId,
        { $set: { password: hash } },
        { new: true }
    );
    return admin
}

module.exports = {
    signup,
    getAdmin,
    getAdmiById,
    updateAdmin,
    resetPassword
};