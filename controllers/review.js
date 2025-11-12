const reviewFunction = require("../functions/review");
const userFunction = require("../functions/user");
const propertyFunction = require("../functions/property");

const addReview = async (req, res) => {
  try {
    if(req.body.vendorId){
      const isExist = await reviewFunction.getReviewByVendorAndUserId(req.body.userId,req.body.vendorId);
      if(isExist) return res.status(400).json({success: false,message: "Review already exist!",});
    }
    if(req.body.propertyId){
      const isExist = await reviewFunction.getReviewByPropertyAndUserId(req.body.userId,req.body.propertyId);
      if(isExist) return res.status(400).json({success: false,message: "Review already exist!",});
    }
    const review = await reviewFunction.createReview(req);
    if (!review) return res.status(400).json({success: false,message: "Review Not Added!",});
    if(review.vendorId){
      const avg = await reviewFunction.avgRatingOfVendor(review.vendorId);
      const update = await userFunction.updateVendorAvgRating(review.vendorId,avg.averageRating,avg.totalReviews);
    };
    if(review.propertyId){
      const avg = await reviewFunction.avgRatingOfHotel(review.propertyId);
      const update = await propertyFunction.updatePropertyAvgRating(review.propertyId,avg.averageRating,avg.totalReviews);
    };
    return res.status(200).json({success: true,message: "Review Added Successfully!",data: review,});
    
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewFunction.getAllReviews(req);
    if (reviews.length === 0) return res.status(400).json({success: false,message: "No Reviews Found!",});
    return res.status(200).json({success: true,message: "All Reviews Found!",data: reviews,});
    
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const updateReviews = async (req, res) => {
  try {
    const review = await reviewFunction.updateReview(req);
    if (!review) return res.status(400).json({success: false,message: "Review Not Found to Updated!",});
    if(review.vendorId){
      const avg = await reviewFunction.avgRatingOfVendor(review.vendorId);
      const update = await userFunction.updateVendorAvgRating(review.vendorId,avg.averageRating,avg.totalReviews)
    };
    if(review.propertyId){
      const avg = await reviewFunction.avgRatingOfHotel(review.propertyId);
      const update = await propertyFunction.updatePropertyAvgRating(review.propertyId,avg.averageRating,avg.totalReviews)
    };
    return res.status(200).json({success: true,message: "Review Details updated Successfully!",data: review,});
    
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await reviewFunction.deleteReview(req);
    if (!review) return res.status(400).json({success: false,message: "Review Not Found to Delete!",});
    if(review.vendorId){
      const avg = await reviewFunction.avgRatingOfVendor(review.vendorId);
      const update = await userFunction.updateVendorAvgRating(review.vendorId,avg.averageRating,avg.totalReviews)
    };
    if(review.propertyId){
      const avg = await reviewFunction.avgRatingOfHotel(review.propertyId);
      const update = await propertyFunction.updatePropertyAvgRating(review.propertyId,avg.averageRating,avg.totalReviews)
    };
    return res.status(200).json({success: true,message: "Review Deleted Successfully!"});
    
  } catch (error) {
    console.log("Having Errors:", error);
    return res.status(400).json({success: false,message: "Something Went Wrong!",error: error.message,});
  }
};

module.exports = {
  addReview,
  getAllReviews,
  updateReviews,
  deleteReview,
};