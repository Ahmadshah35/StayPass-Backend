const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactSchema = new Schema({
    ownerId:{
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    propertyId: {
        type: Schema.Types.ObjectId,
        ref: "Property",
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        // required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    message: {
        type: String
    }
});

const contactModel = mongoose.model("ContactForm", contactSchema);
module.exports = contactModel;