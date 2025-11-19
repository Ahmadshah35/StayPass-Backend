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
    const { userId, vendorId, propertyId, rating, reviewId } = req.query;
    const filter = {};
    if(userId) filter.userId = userId
    if(vendorId) filter.vendorId = vendorId
    if(propertyId) filter.propertyId = propertyId
    if(reviewId) filter._id = reviewId
    if(rating) filter.rating = rating
    const reviews = await reviewModel.find(filter);
    return reviews
};

const replyToReview = async (req) => {
  const {reviewId, vendorId, message } = req.body;

  const reply = { vendorId, message, };

  const updatedPost = await reviewModel.findOneAndUpdate(
    { _id: reviewId },
    { $push: { replies: reply } },
    { new: true }
  );
  return updatedPost;
};

const deleteReply = async (req) => {
  const { reviewId, replyId } = req.body;

  const updatedReview = await reviewModel.findOneAndUpdate(
    { _id: reviewId, "replies._id": replyId },
    { $pull: { replies: { _id: replyId } } },
    { new: true }
  );

  return updatedReview;
};

const updateReply = async (req) => {
  const {vendorId, reviewId, replyId, message } = req.body;
  const now = new Date();

  const updatedReview = await reviewModel.findOneAndUpdate(
    { _id: reviewId, "replies._id": replyId, "replies.vendorId": vendorId },
    {
      $set: {
        "replies.$.message": message.trim(),
        "replies.$.updatedAt": now,
      },
    },
    { new: true }
  )
  .populate("userId", "name image email")
  .populate("replies.vendorId", "name image email");

  return updatedReview;
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
replyToReview,
updateReply,
deleteReply,
updateReview,
deleteReview,
avgRatingOfHotel,
avgRatingOfVendor,
getAllReviews,
getReviewByPropertyAndUserId,
getReviewByVendorAndUserId
};
