const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

const commentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, required: true, trim: true },
    replies: [replySchema],
  },
  { timestamps: true }
);

const shareSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message: { type: String, trim: true },
  },
  { timestamps: true }
);

const PostSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    posts: [{ type : String }],
    caption: { type: String, trim: true, },
    like: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comment: [commentSchema],
    share: [shareSchema],
    state:{type:String},
    totalLikes: { type: Number, default: 0 },
    totalComments: { type: Number, default: 0 },
    totalShares: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const postModel = mongoose.model("Post", PostSchema);
module.exports = postModel;
