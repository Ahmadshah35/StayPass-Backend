const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    roomNo: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      enum: ["Single", "Double", "Family Suite", "Deluxe", "King Size"],
      required: true,
    },
    roomName: {
      type: String,
    },
    maxOccupancy: {
      type: Number,
    },
    bedType: {
      type: String,
      enum: ["King", "Queen", "Twin", "Sofa Bed"],
    },
    window: {
      type: String,
      enum: ["Smoking", " Non Smoking"],
    },
    privateBathrooms: {
      type: String,
      enum: ["Yes", "No"],
    },
    facilities: {
      type: [String],
      enum: ["Wifi", "TV", " Mini Bar", "Air Conditioning"],
    },
    pricePerNight: {
      type: Number,
      required: true,
    },
    serviceCharges: {
      type: Number,
    },
    blockedDates: {
      type: [String],
    },
    roomImages: {
      type: [String],
    },
  },
  { timestamps: true }
);
const roomModel = mongoose.model("Room", roomSchema);
module.exports = roomModel;
