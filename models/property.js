const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertySchema = new Schema({
    // Data Structure for type "Sell, Rent, Lease"
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    category:{
        type: String,
        enum: ["Sell", "Rent", "Vocational Rent", "Lease"],
        required: true
    },
    propertyName:{
        type: String,
        required: true
    },
    propertySize: {
        type: String
    },
    type: {
        type: String,
        enum: ["Apartment", "House", "Villa", "Condo"],
    },
    noOfRooms: {
        type: String
    },
    noOfBathrooms:{
        type: String
    },
    country:{
        type: String
    },
    state:{
        type: String
    },
    city:{
        type: String
    },
    zipCode:{
        type: String
    },
    address:{
        type: String
    },
    propertyDescription:{
        type: String
    },
    price: {
        type: Number,
        required: true
    },
    images: [{
        type: String
    }],
    features: [{
        type: String,
        enum: ["Parking", "Swimming Pool", "Garden", "Furnished", "Unfurnished"],
        required: true
    }],
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    location:{
        type: {
            type: String,
            enum: ["Point"]
        },
        coordinates: {
            type: [Number]
        },
        locationName: {
            type: String
        }
    },
    longitude: {
        type: Number
    },
    latitude: {
        type: Number
    },
    locationName: {
        type: String
    },
    isFeatured: {
        type: String,
        enum: ["None", "Hot Property", "Super Hot Property"] 
    },
    // Additional Fields for type "Vocational Rent"
    propertyType: [{
        type: String
    }],
    amenities: [{
        type: String
    }],
    checkinTime: {
        type: String,
    },
    checkoutTime: {
        type: String
    },
    cancellationPolicy: {
        type: String
    },
    houseRules: {
        type: String
    },
    coverImage: [{
        type: String
    }],
    addRooms:[{
        roomNo: [{
            type: String,
        }],
        roomType: {
            type: String,
            enum: ["Single Room", "Double Room", "Family Suite", "Deluxe Room", "King Size Room"]
        },
        roomName: {
            type: String
        },
        maxOccupancy: {
            type: Number
        },
        bedType: {
            type: String,
            enum: ["King", "Queen", "Twin", "Sofa Bed"]
        },
        window: {
            type: String,
            enum: ["Smoking", " Non Smoking"]
        },
        private: {
            type: String,
            enum: ["Yes", "No"]
        },
        facilities: [{
            type: String,
            enum: ["Wifi", "TV", " Mini Bar", "Air Conditioning"],
        }],
        roomImages: [{
            type: String
        }],
        pricePerNight: {
            type: Number
        },
        serviceCharges: {
            type: Number
        },
        blockedDates: [{
            type: String
        }]
    }],
    averageRating: {
        type: Number,
    },
    reviewCount:{
        type: Number,
    },
    oneStar: {
        type: Number
    },
    twoStar: {
        type: Number
    },
    threeStar: {
        type: Number
    },
    fourStar: {
        type: Number
    },
    fiveStar: {
        type: Number
    },
}, { timestamps: true });

propertySchema.index({ location: "2dsphere" });

const propertyModel = mongoose.model("Property", propertySchema);
module.exports = propertyModel;