const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv").config();
const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4004;
const routes = require("./routes/route");
const connectDB = require("./db/config");
const path = require("path");

app.use(cors());
app.use(express.json());

app.use("/", express.static(path.resolve(__dirname, "./public/property")));
app.use("/", express.static(path.resolve(__dirname, "./public/userProfile")));
app.use("/", express.static(path.resolve(__dirname, "./public/post"),{
  setHeaders: (res, filePath) => {
  // Handle video content type
  if (filePath.endsWith(".mp4")) {
    res.setHeader("Content-Type", "video/mp4");
  }
  // Handle images (jpg, jpeg, png, gif, webp)
  else if (
    filePath.endsWith(".jpg") ||
    filePath.endsWith(".jpeg") ||
    filePath.endsWith(".png") ||
    filePath.endsWith(".gif") ||
    filePath.endsWith(".webp")
  ) {
    res.setHeader("Content-Type", `image/${path.extname(filePath).substring(1)}`);
  }
  // Optional: PDF, audio, etc.
  else if (filePath.endsWith(".pdf")) {
    res.setHeader("Content-Type", "application/pdf");
  } else if (filePath.endsWith(".mp3")) {
    res.setHeader("Content-Type", "audio/mpeg");
  }
  },
}));


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
