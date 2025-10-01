const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth");

router.post("/user/signup", authController.signUp);
router.post("/userverifyOTP", authController.verifyOTP);
router.post("/user/login", authController.login);
router.get("/user/getProfile", authController.getUserProfile);
router.post("/user/updateProfile", authController.updateUser);
router.post("/user/deleteUser", authController.deleteUser);
router.get("/user/getAllUsers", authController.getAllUsers);

module.exports = router;