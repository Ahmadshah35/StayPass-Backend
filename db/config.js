const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URL);
        console.log("MongoDB is Successfully Connected!")
    } catch (error) {
        console.log("Error While Connecting DB!", error);
    }
};

module.exports = connectDB;