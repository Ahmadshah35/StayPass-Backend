const express = require("express");
const route = express.Router();
const uploadController = require("../middleware/auth");
const authController = require("../controllers/auth");
const propertyController = require("../controllers/property");
const roomController = require('../controllers/room');
const contactFormController = require("../controllers/contact");
const bookingController = require("../controllers/booking");
const favoriteController = require("../controllers/favorite");
const reviewController = require("../controllers/review");
const postController = require("../controllers/post");
const walletController = require("../controllers/wallet");


// Auth
route.post("/user/signUpOrLoginAdminByGoogle", authController.signUpOrLoginAdminByGoogle);
route.post("/user/signup", authController.signUp);
route.post("/user/VerifyOtpAndCreate", authController.VerifyOtpAndCreate);
route.post("/user/login", authController.login);
route.post("/user/updateProfile",uploadController.userUpload.single("image"), authController.updateUser);
route.post("/user/deleteUser", authController.deleteUser);
route.post("/user/forgetPassword", authController.forgetPassword);
route.post("/user/resetPassword", authController.resetPassword);
route.post("/user/changePassword", authController.changePassword);
route.post("/user/verifyOtp", authController.verifyOtp);
route.get("/user/getProfile", authController.getUserProfile);
route.get("/user/getAllUsers", authController.getAllUsers);

// Property
route.post("/user/addProperty",uploadController.propertyUpload.fields([{ name: "images", maxCount: 5 },{ name: "coverImage", maxCount: 2 }]), propertyController.addProperty);
route.post("/user/updateProperty",uploadController.propertyUpload.fields([{ name: "images", maxCount: 5 },{ name: "coverImage", maxCount: 2 }]), propertyController.updateProperty);
route.get("/user/getAllProperties", propertyController.getAllProperties);
route.post("/user/deleteProperty", propertyController.deleteProperty);

// Room
route.post("/user/createRoom",uploadController.propertyUpload.fields([{ name: "roomImages", maxCount: 5 }]), roomController.createRoom);
route.post("/user/updateRoom",uploadController.propertyUpload.fields([{ name: "roomImages", maxCount: 5 }]), roomController.updateRoom);
route.get("/user/getAllRooms", roomController.getAllRooms);
route.post("/user/deleteRoom", roomController.deleteRoom);

// Contact Form
route.post("/user/createContactForm", contactFormController.createContactForm);
route.get("/user/getAllContactForms", contactFormController.getAllContactForms);
route.post("/user/deleteContactForm", contactFormController.deleteContactForm);

// Booking
route.post("/user/createBooking", bookingController.createBooking);
route.post("/user/updateBooking", bookingController.updateBooking);
route.post("/user/deleteBooking", bookingController.deleteBooking);
route.get("/user/getAllBookings", bookingController.getAllBookings);
route.get("/user/getBookingById", bookingController.getBookingById);
route.get("/user/getAllMonthlyBookings", bookingController.getAllMonthlyBookings);

//Favorite
route.post("/user/addOrRemoveFavorite", favoriteController.addOrRemoveFavorite);
route.get("/user/getFavorites",uploadController.checkUserAuth ,favoriteController.getFavorites);

//Review
route.post("/user/addReview", reviewController.addReview);
route.post("/user/updateReviews", reviewController.updateReviews);
route.post("/user/deleteReview", reviewController.deleteReview);
route.get("/user/getAllReviews", reviewController.getAllReviews);
route.post("/user/giveReplyOnReview", reviewController.giveReplyOnReview);
route.post("/user/deleteReply", reviewController.deleteReply);
route.post("/user/updateReply", reviewController.updateReply);

//Post
route.post("/user/createPost",uploadController.postUpload.fields([{name :"posts",maxCount:"4"}]),postController.createPost)
route.post("/user/editPost",uploadController.postUpload.fields([{name :"posts",maxCount:"4"}]),postController.editPost)
route.post("/user/deletePost",postController.deletePost)
route.post("/user/likeAndUnLikePost",postController.likeAndUnLikePost)
route.post("/user/commentByUser",postController.commentByUser)
route.post("/user/replyByUser",postController.replyByUser)
route.post("/user/sharePost",postController.sharePost)
route.get("/user/getPostById",postController.getPostById)
route.get("/user/getAllPost",postController.getAllPost)

// Wallet
route.post("/user/paymentWithWallet", walletController.paymentWithWallet);
route.get("/user/getWalletByUserId", uploadController.checkUserAuth, walletController.getWalletByUserId);







module.exports = route;
