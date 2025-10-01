const express = require("express");
const http = require("http");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4040;

const connectDB = require("./db/config");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("StayPass-Backend is Wokring!")
});

app.use("/", require("./routes/auth"));
app.use("/", require("./routes/property"));

const start = async () => {
    try {
        connectDB();
        server.listen(PORT, () => {
            console.log(`Server is Running on Port: ${PORT}`);
        })
    } catch (error) {
        console.log("having Error while Running Server:", error);
    }
};

start();