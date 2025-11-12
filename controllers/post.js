const postFunc = require("../functions/post");
const userFunc = require("../functions/user")
const createPost = async(req,res) =>{
  try {
    const user = await userFunc.getUserProfileById(req.body.userId);
    if(!user) return res.status(400).json({success:false,message :"user not found"})
    if(user.type == "User"){
    const post = await postFunc.createPost(req);
    if(!post) return res.status(400).json({success:false,message :"post not Created"});
    return res.status(200).json({success:true,message:"Post Created Successfully",data:post})
    }
    return res.status(400).json({success:false,message :"Seller cannot create posts"});
    } catch (error) {
    console.log("Error",error.message);
    return res.status(400).json({success:false, message:"Something went wrong"})
  }
};

const editPost = async(req,res) =>{
  try {
    const post = await postFunc.editPost(req);
    if(!post) return res.status(400).json({success:false,message :"post isn't Updated"})
    return res.status(200).json({success:true,message:"Post Updated Successfully",data:post})
    } catch (error) {
    console.log("Error",error.message);
    return res.status(400).json({success:false, message:"Something went wrong"})
  }
};

const deletePost = async(req,res) =>{
  try {
    const post = await postFunc.deletePost(req);
    if(!post) return res.status(400).json({success:false,message :"post not found"})
    return res.status(200).json({success:true,message:"Post deleted Successfully"})
    } catch (error) {
    console.log("Error",error.message);
    return res.status(400).json({success:false, message:"Something went wrong"})
    }
};

const likeAndUnLikePost = async(req,res) =>{
  try {
    const {userId} = req.body
    const post = await postFunc.getPostByPostId(req);
    if(!post) return res.status(400).json({success:false , message:"Post not found"});

    let updatedPost;
    let message;
    const isAlreadyLiked = post.like.includes(userId);
    if(isAlreadyLiked){
      updatedPost = await postFunc.unLikePost(req);
      message = "Post UnLiked Successfully"
    }else{
      updatedPost = await postFunc.likePost(req);
      message = "Post Liked Successfully"
    }
    return res.status(200).json({success:true,message:message,data:updatedPost});
    
    } catch (error) {
    console.log("Error",error.message);
    return res.status(400).json({success:false, message:"Something went wrong"});
    }
};

const commentByUser = async (req,res) =>{
  try {
    const comment = await postFunc.commentPost(req);
    if(!comment) return res.status(400).json({success:false,message :"Failed to add comment"});
    return res.status(200).json({success:true,message:"Comment added successfully",data:comment});
  } catch (error) {
    console.log("Error",error.message);
    return res.status(400).json({success:false, message:"Something went wrong"});
  }
};

const replyByUser = async (req, res) => {
  try {
    const reply = await postFunc.replyToComment(req);
    if (!reply) return res.status(400).json({ success: false, message: "Failed to add reply" });
    return res.status(200).json({ success: true, message: "Reply added successfully", data: reply });
  } catch (error) {
    console.log("Error:", error.message);
    return res.status(400).json({ success: false, message: "Something went wrong" });
  }
};

const sharePost = async (req,res) =>{
  try {
    const share = await postFunc.sharePost(req);
    if(!share) return res.status(400).json({success:false,message :"Failed to share Post"});
    return res.status(200).json({success:true,message:"Successfully Post Shared",data:share});
  } catch (error) {
    console.log("Error",error.message);
    return res.status(400).json({success:false, message:"Something went wrong"});
  }
};

const getPostById = async (req,res) =>{
  try {
    const getPost = await postFunc.getPostById(req);
    if(!getPost) return res.status(400).json({success:false,message :"Post not found"});
    return res.status(200).json({success:true,message:"Post's",data:getPost});
  } catch (error) {
    console.log("Error",error.message);
    return res.status(400).json({success:false, message:"Something went wrong"});
  }
};

const getAllPost = async (req,res) =>{
  try {
    const getAll = await postFunc.getAllPosts(req);
    if(!getAll || getAll.length == 0) return res.status(400).json({success:false,message :"Post not found"});
    return res.status(200).json({success:true,message:"Post's",data:getAll});
  } catch (error) {
    console.log("Error",error.message);
    return res.status(400).json({success:false, message:"Something went wrong"});
  }
};


module.exports ={
  createPost,
  editPost,
  deletePost,
  likeAndUnLikePost,
  sharePost,
  commentByUser,
  replyByUser,
  getPostById,
  getAllPost
};
