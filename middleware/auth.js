const jwt = require("jsonwebtoken");
const multer = require("multer");
require("dotenv").config();
const userModel = require("../models/user");

const verifyUser = async (req, res, next) => {
    const bearerHeader = req.headers['authorization'];
    if( typeof bearerHeader !== "undefined"){
        const bearer = bearerHeader.split(" ")[1];
        req.token = bearer;
        jwt.verify(bearer, process.env.SECRET_KEY, async (error, authData) => {
            if(error){
                console.log("Invalid Token :", error);
                return res.status(403).json({
                    msg: "Invalid Token !"
                })                
            } else {
                let id = authData.id;
                let userData = await userModel.findById(id).select("-password");
                req.user = userData;
                next();
            }
        })
    } else {
        return res.status(403).json({
            msg: "Token Not Found!"
        })
    }
};

const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/user")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const uploadUser = multer({ storage: userStorage });

const propertyStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./public/property")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }
});

const propertyUpload = multer({ storage: propertyStorage });

module.exports = {
    verifyUser,
    uploadUser,
    propertyUpload
};