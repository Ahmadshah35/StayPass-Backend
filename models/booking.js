const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    roomId: {
      type: Schema.Types.ObjectId,
      ref:"Room",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref:"User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    checkInDate: {
      type: String,
      required: true,
    },
    checkOutDate: {
      type: String,
      required: true,
    },
    BookingDates:[{
      type:String
    }],
    noOfOccupancy: {
      type: Number,
      required: true,
    },
    noOfNights: {
      type: Number,
      required: true,
    },
    roomSerialNo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Rejected"],
    },
  },
  { timestamps: true }
);

const bookingModel = mongoose.model("Booking", bookingSchema);
module.exports = bookingModel;
