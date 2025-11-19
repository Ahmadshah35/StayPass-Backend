const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  type: {
    type: String,
    enum: ["User", "Vendor"],
    requried: true,
  },
  email: {
    type: String,
    lowercase: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  name: {
    type: String,
  },
  phone: {
    type: Number,
  },
  DOB: {
    type: String,
  },
  city: {
    type: String,
  },
  longitude: {
    type: Number,
  },
  latitude: {
    type: Number,
  },
  locationName: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      // required: true,
    },
    coordinates: {
      type: [Number],
    },
    locationName: {
      type: String,
    },
  },
  avgRating: {
    type: Number,
  },
  totalReviews: {
    type: Number,
  },
  walletBalance: {
    type: Number,
    default: 0,
  },
  forSale: {
    type: Number,
  },
  forRent: {
    type: Number,
  },
  forVocationalRent: {
    type: Number,
  },
  forLease: {
    type: Number,
  },
  bankName: {
    type: String,
  },
  accountTittle: {
    type: String,
  },
  accountNumber: {
    type: Number,
  },
  FCMToken: {
    type: String,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
});

userSchema.index({ location: "2dsphere" });

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
