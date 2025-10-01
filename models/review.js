const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    propertyId: {
        type: Schema.Types.ObjectId,
        ref: "Property",
        requried: true
    },
    vendorId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    star: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true 
    },
    message: {
        type: String,
        required: true
    },
});

const reviewModel = mongoose.model("Review", reviewSchema);
module.exports = reviewModel;