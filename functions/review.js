const mongoose = require("mongoose");
const reviewModel = require("../models/review");

const addReview = async (req) => {
    const newReview = new reviewModel(req.body);
    const result = await newReview.save();
    return result
};

const getReviewById = async (req) => {
    const { reviewId } = req.query;
    const review = await reviewModel.findById(reviewId);
    return review
};

const getAllReviews = async (req) => {
    const { userId, vendorId, propertyId, star } = req.query;
    const filter = {};
    if(userId){
        filter.userId = userId
    }
    if(vendorId){
        filter.vendorId = vendorId
    }
    if(propertyId){
        filter.propertyId = propertyId
    }
    if(star){
        filter.star = star
    }
    const reviews = await reviewModel.find(filter);
    return reviews
};

const updateReview = async (req) => {
    const { reviewId } = req.body;
    const updatedData = req.body;

    const review = await reviewModel.findByIdAndUpdate(reviewId,
        { $set: updatedData },
        { new: true }
    );
    return review
};

const deleteReview = async (req) => {
    const { reviewId } = req.body;s
    const review = await reviewModel.findByIdAndDelete(reviewId);
    return review
};

const getAvgRating = async (req) => {
    const { propertyId } = req.body;

    const ratings = await ReviewModel.aggregate([
      {
        $match: { propertyId: new mongoose.Types.ObjectId(propertyId) }
      },
      {
        $group: {
          _id: "$propertyId",
          averageRating: { $avg: "$star" },
          totalCount: { $sum: 1 }, // overall total count
          count1: { $sum: { $cond: [{ $eq: ["$star", 1] }, 1, 0] } },
          count2: { $sum: { $cond: [{ $eq: ["$star", 2] }, 1, 0] } },
          count3: { $sum: { $cond: [{ $eq: ["$star", 3] }, 1, 0] } },
          count4: { $sum: { $cond: [{ $eq: ["$star", 4] }, 1, 0] } },
          count5: { $sum: { $cond: [{ $eq: ["$star", 5] }, 1, 0] } }
        }
      }
    ]);

    return ratings
};

module.exports = {
    addReview,
    getReviewById,
    getAllReviews,
    updateReview,
    deleteReview
};