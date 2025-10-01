const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB is Successfully Connected!")
    } catch (error) {
        console.log("Error While Connecting DB!", error);
    }
};

module.exports = connectDB;