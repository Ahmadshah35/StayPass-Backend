const userModel = require("../models/user");
const bcrypt = require('bcrypt');

const signup = async (decode) => {
    const hash = await bcrypt.hash(decode.password, 10);
    const newUser = await userModel.create({
    email:decode.email,
    password:hash,
    phone:decode.phone,
    name:decode.name,
    type:decode.type
    });
    return newUser;
};

const signUpUserByGoogle = async (req) => {
  const { email, FCMToken ,type} = req.body;
  const password = process.env.socialAuthPassword;
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const user = await userModel.create({email,password: hashPassword,FCMToken: FCMToken,type:type});
  return user;
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

const getUserProfile = async (email) => {
    const user = await userModel.findOne({email: email}).select("-password");
    return user
};

const getUserProfileById = async (id) => {
    const user = await userModel.findOne({_id: id}).select("-password");
    return user
};


const updateUser = async (req) => {
  const { id } = req.body;
  const userData = req.body;
  if (userData.latitude && userData.longitude) {
    userData.location = {
      type: "Point",
      coordinates: [parseFloat(userData.longitude),parseFloat(userData.latitude),],
      locationName: userData.locationName,
    };
    if(!userData.locationName) userData.locationName = userData.locationName || null
  }
  if (req.file && req.file.filename) userData.image = req.file.filename;
  
  const user = await userModel.findByIdAndUpdate(id,{ $set: userData },{ new: true }).select("-password");
  return user;
};

const getAllUsers = async (req) => {
    const { type } = req.query;
    const filter = {isDeleted:false};
    if(type){
        filter.type = type;
    }
    const users = await userModel.find(filter).select("-password");
    return users
};

const deleteUser = async (req) => {
    const { userId } = req.body;
    const user = await userModel.findByIdAndUpdate(userId,{$set:{name:null,image:null,phone:null,isDeleted:true}});
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

const updateVendorAvgRating = async (id, avgRating ,totalReviews) => {
  const updatedProfile = await userModel.findByIdAndUpdate(
    id,
    { $set: { avgRating: avgRating,totalReviews:totalReviews } },
    { new: true }
  );
  return updatedProfile;
};

module.exports = {
    signup,
    signUpUserByGoogle,
    getUser,
    getUserProfileById,
    getUserProfile,
    getUserById,
    getAllUsers,
    updateUser,
    deleteUser,
    resetPassword,
    updateVendorAvgRating
};