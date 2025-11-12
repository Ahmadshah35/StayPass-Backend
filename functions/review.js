const { default: mongoose } = require("mongoose");
const reviewModel = require("../models/review")


const createReview = async (req) => {
  const review = new reviewModel(req.body);
  const result = await review.save();
  return result;
};

const updateReview = async (req) => {
  const {reviewId } = req.body;
  const {...userData} = req.body 
  const review = await reviewModel.findByIdAndUpdate(
    reviewId,
    { $set: {...userData} },
    { new: true }
  );
  return review;
};

const deleteReview = async (req) => {
  const {reviewId} = req.body
  const review = await reviewModel.findByIdAndDelete({_id:reviewId}, {
    new: true,
  });
  return review;
};

const getAllReviews = async (req) => {
    const { userId, vendorId, propertyId, star, reviewId } = req.query;
    const filter = {};
    if(userId) filter.userId = userId
    if(vendorId) filter.vendorId = vendorId
    if(propertyId) filter.propertyId = propertyId
    if(reviewId) filter._id = reviewId
    if(rating) filter.rating = rating
    const reviews = await reviewModel.find(filter);
    return reviews
};

const avgRatingOfVendor = async (vendorId) => {
  const result = await reviewModel.aggregate([
    { $match: { vendorId: new mongoose.Types.ObjectId(vendorId) } },
    {
      $group: {
        _id: "$vendorId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const rating = result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
  return rating;
};

const avgRatingOfHotel = async (propertyId) => {
  const result = await reviewModel.aggregate([
    { $match: { propertyId: new mongoose.Types.ObjectId(propertyId) } },
    {
      $group: {
        _id: "$propertyId",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  const rating = result.length > 0 ? result[0] : { averageRating: 0, totalReviews: 0 };
  return rating;
};

const getReviewByVendorAndUserId = async (userId,vendorId) => {
  const reviews = await reviewModel.findOne({userId:userId,vendorId:vendorId});
  return reviews
};

const getReviewByPropertyAndUserId = async (userId,propertyId) => {
  const reviews = await reviewModel.findOne({userId:userId,propertyId:propertyId});
  return reviews
};

module.exports = {
createReview,
updateReview,
deleteReview,
avgRatingOfHotel,
avgRatingOfVendor,
getAllReviews,
getReviewByPropertyAndUserId,
getReviewByVendorAndUserId
};
