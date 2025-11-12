const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv").config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT;
const routes = require("./routes/route");
const connectDB = require("./db/config");
const path = require("path");

app.use(cors());
app.use(express.json());

app.use("/", express.static(path.resolve(__dirname, "./public/property")));
app.use("/", express.static(path.resolve(__dirname, "./public/userProfile")));
app.use("/", express.static(path.resolve(__dirname, "./public/post")));


app.get("/", (req, res) => { res.send("StayPass-Backend is Wokring!") });

app.use("/api", routes);

const start = async () => {
  try {
    connectDB();
    server.listen(PORT, () => {console.log(`Server is Running on Port: http://localhost:${PORT}`)});
  } catch (error) {
    console.log("having Error while Running Server:", error);
  }
};

start();
