const postModel = require("../models/post");
const userModel = require("../models/user");

const createPost = async (req) => {
  const posts = req.files?.posts?.map((file) => file.filename) || [];

  const post = await postModel.create({ ...req.body, posts: posts, });
  return post;
};

const editPost = async (req) => {
  const { postId, caption } = req.body;

  const posts = req.files?.posts?.map((file) => file.filename);
  
  const updatedPost = await postModel.findByIdAndUpdate( postId, { $set: { posts: posts, caption } }, { new: true } );

  return updatedPost;
};


const deletePost = async (req) => {
  const { postId } = req.body;
  const post = await postModel.findByIdAndDelete(postId, { new: true });
  return post;
};

const likePost = async (req) => {
  const { userId, postId } = req.body;

  const updatedPost = await postModel.findByIdAndUpdate( postId, { $addToSet: { like: userId } }, { new: true } );

  updatedPost.totalLikes = updatedPost.like.length;
  await updatedPost.save();

  return updatedPost;
};

const unLikePost = async (req) => {
  const { userId, postId } = req.body;

  const updatedPost = await postModel.findByIdAndUpdate( postId, { $pull: { like: userId } }, { new: true } );

  updatedPost.totalLikes = updatedPost.like.length;
  await updatedPost.save();

  return updatedPost;
};

const commentPost = async (req) => {
  const { userId, postId, message } = req.body;

  const comment = { message, userId, };

  const updatedPost = await postModel.findByIdAndUpdate( postId, { $push: { comment: comment } }, { new: true } );

  updatedPost.totalComments = updatedPost.comment.length;
  await updatedPost.save();

  return updatedPost;
};


const replyToComment = async (req) => {
  const { postId, commentId, userId, repliedBy, message } = req.body;

  const reply = { userId, repliedBy, message, };

  const updatedPost = await postModel.findOneAndUpdate(
    { _id: postId, "comment._id": commentId },
    { $push: { "comment.$.replies": reply } },
    { new: true }
  );

  return updatedPost;
};


const sharePost = async (req) => {
  const { userId, postId, message } = req.body;

  const share = { userId, sharedAt: new Date(), };
  if (message) share.message = message;

  const updatedPost = await postModel.findByIdAndUpdate(postId,{ $push: { share: share } },{ new: true });

  updatedPost.totalShares = updatedPost.share.length;
  await updatedPost.save();

  return updatedPost;
};

const getAllPosts = async (req) => {
  const {userId ,state} = req.query
  const filter = {}
  if(userId) filter.userId = userId;
  if(state) filter.state = state;
  const posts = await postModel
    .find(filter)
    .sort({ createdAt: -1 })
    .populate({ path: "userId", select: "name image" })
    .populate({ path: "like", select: "name image" })
    .populate({ path: "comment.userId", select: "name image" })
    .populate({ path: "share.userId", select: "-password" })
    .populate({ path: "comment.replies.userId", select: "name image" })
    .populate({ path: "comment.replies.repliedBy", select: "name image" });
  return posts;
};

const getPostById = async (req) => {
  const postId  = req.query.postId  ||  req.body.postId
  

  const post = await postModel
    .findById({_id :postId})
    .populate({ path: "userId", select: "name image" })
    .populate({ path: "like", select: "name image" })
    .populate({ path: "comment.userId", select: "name image" })
    .populate({ path: "share.userId", select: "-password" })
    .populate({ path: "comment.replies.userId", select: "name image" })
    .populate({ path: "comment.replies.repliedBy", select: "name image" });
  return post;
};

const getPostByPostId = async (req) => {
  const postId  =  req.body.postId
  const post = await postModel.findById({_id :postId});
  return post;
};

module.exports = {
  createPost,
  editPost,
  deletePost,
  likePost,
  unLikePost,
  commentPost,
  replyToComment,
  sharePost,
  getAllPosts,
  getPostById,
  getPostByPostId,  
};