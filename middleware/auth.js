const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();
const userModel = require("../models/user");
const path = require("path");

// const verifyUser = async (req, res, next) => {
//     const bearerHeader = req.headers['authorization'];
//     if( typeof bearerHeader !== "undefined"){
//         const bearer = bearerHeader.split(" ")[1];
//         req.token = bearer;
//         jwt.verify(bearer, process.env.SECRET_KEY, async (error, authData) => {
//             if(error){
//                 console.log("Invalid Token :", error);
//                 return res.status(403).json({
//                     msg: "Invalid Token !"
//                 })                
//             } else {
//                 let id = authData.id;
//                 let userData = await userModel.findById(id).select("-password");
//                 req.user = userData;
//                 next();
//             }
//         })
//     } else {
//         return res.status(403).json({
//             msg: "Token Not Found!"
//         })
//     }
// };


const checkUserAuth = async (req, res, next) => {
  // Extract the authorization header
  const { authorization } = req.headers;
  if (authorization && authorization.startsWith('Bearer')) {
    try {
      // Extract the token from the Bearer scheme
      const token = authorization.split(' ')[1];
      console.log("token",token)
      if (!token) return res.send({ success: false, message: "Token not found" });
      
      // Verify the token
      const { _id } = jwt.verify(token, process.env.SECRET_KEY);

      // Get the user from the token
      req.user = await userModel.findById(_id).select('-password');
      
      // Call the next middleware
      next();
    } catch (err) {
      console.error('Error verifying token:', err.message);
      return res.send({ success: false, message: "Unauthorized access" });
    }
  } else {
    return res.send({ success: false, message: "Authorization header not found" });
  }
};

const userStorage = multer.diskStorage({
  destination: "./public/userProfile",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const userUpload = multer({storage: userStorage,});


const PropertyStorage = multer.diskStorage({
  destination: "./public/property",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const propertyUpload = multer({storage: PropertyStorage,});


// const postStorage = multer.diskStorage({
//   destination: "./public/post",
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + "-" + file.originalname);
//   },
// });
// const postUpload = multer({storage: postStorage,});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/post");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext);
    const safeName = base.replace(/\s+/g, "_"); // <-- remove spaces
    cb(null, Date.now() + "-" + safeName + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const imageTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/heic"];
  const videoTypes = ["video/mp4", "video/mov", "video/avi", "video/mkv", "video/webm"];

  if (imageTypes.includes(file.mimetype) || videoTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image and video files are allowed!"), false);
  }
};

// 10 MB for images, 50 MB for videos
const postUpload = multer({
  storage,
  fileFilter,
  // limits: { fileSize: 50 * 1024 * 1024 },
});


module.exports = {
    checkUserAuth,
    // verifyUser,
    userUpload,
    postUpload,
    propertyUpload
};