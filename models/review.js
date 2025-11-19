const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const replySchema = new Schema({
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
},{ timestamps: true });

const reviewSchema = new Schema({
  propertyId: {
    type: Schema.Types.ObjectId,
    ref: "Property",
  },
  vendorId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    required: true,
  },
  message: {
    type: String,
  },
  replies: [replySchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
},{timestamps: true});

const reviewModel = mongoose.model("Review", reviewSchema);
module.exports = reviewModel;
