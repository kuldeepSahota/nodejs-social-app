const { default: mongoose } = require("mongoose");
const Comment = require("../models/Comment");
const Like = require("../models/Like");
const Post = require("../models/Post");
const { success, error } = require("../utils/helpers");

const createPost = async (req, res) => {
  const { title, description,filename } = req.body;
  const user = req.user;

  try {
    
    let post;

    post = new Post({ title, description, userId: user.id,files:filename });
    await post.save();
    res.json({
      success: true,
      code: 200,
      message: "Post created successfully",
      body: {
        post,
      },
    });
  } catch (error) {
    res.json({
      success: false,
      code: 500,
      message: "Server error",
    });
  }
};
const getPosts = async (req, res) => {
  try {
    // Parse and validate limit and offset
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    // Ensure limit and offset are non-negative
    if (limit < 0 || offset < 0) {
      return res.status(400).json({
        success: false,
        code: 400,
        message: "Limit and offset must be non-negative integers",
      });
    }
    let query = [
      {
        $match: { userId: { $ne: req.user.id } },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      // {
      //     $limit: limit
      // },
      // {
      //     $skip: offset
      // }
    ];
    //   const posts = await Post.aggregate(query).skip(offset).limit(limit); // Only populate necessary fields
    const posts = await Post.aggregate(query); // Only populate necessary fields
    const count = await Post.find().countDocuments();
    res.json({
      success: true,
      code: 200,
      message: "Posts fetched successfully",
      body: { posts, total: count },
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      success: false,
      code: 500,
      message: "Internal server error",
    });
  }
};

const postLike = async (req, res) => {
  try {
    let payload = {
      status: req.body.status,
      userId: req.user.id,
      postId: req.body.postId,
    };
    let checkPost = await Like.findOne({
      postId: payload.postId,
      userId: payload.userId,
    });
    if (checkPost) {
      checkPost.status = payload.status;
      await checkPost.save();
      return res.json({
        success: true,
        code: 200,
        message: `Post ${payload.status ? "liked" : "unlike"} successfully`,
      });
    } else {
      let like = await Like.create(payload);
      return res.json({
        success: true,
        code: 200,
        message: `Post ${payload.status ? "liked" : "unlike"} successfully`,
      });
    }
  } catch (error) {}
};

const singlePost = async (req, res) => {
  try {
    let postId = req.params.postId;
    let query = [
      {
        $match: {
          _id: new mongoose.Types.ObjectId(postId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $lookup: {
          from: "comments",
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
    ];
    let post = await Post.aggregate(query);
    if (!post) {
      error(res, 200, "No post found");
    } else {
      success(res, true, 200, "Post fetched successfully", post);
    }
  } catch (error) {
    return error(500, "Internal server error");
  }
};

const commentPost = async (req, res) => {
  try {
    let payload = {
      postId: req.body.postId,
      userId: req.user.id,
      comment: req.body.comment,
    };
    if (req.body.parentId) {
      payload.parentId = req.body.parentId;
    }
    let comment = await Comment.create(payload);
    success(res, true, 200, "Comment created successfully", comment);
  } catch (error) {
    error(500, "Internal server error");
  }
};

const deletePost = async (req, res) => {
  try {
    let postId = req.params.postId;
    let deletePost = await Post.findByIdAndDelete(postId);
    if (deletePost) {
      await Like.deleteMany({
        postId,
      });
      await Comment.deleteMany({
        postId,
      });
      success(res, true, 200, "Post deleted successfully");
    } else {
      success(res, false, 404, "Post Not found");
    }
  } catch (error) {
    error(500, "Internal server error");
  }
};

const updatePost = async (req, res) => {
  try {
    let postId = req.params.postId;
    let updatePost = await Post.findByIdAndUpdate(postId, req.body, {
      new: true,
    });
    if (updatePost) {
      success(res, true, 200, "Post updated successfully", updatePost);
    } else {
      success(res, false, 404, "Post Not found");
    }
  } catch (error) {
    error(500, "Internal server error");
  }
};

const uploadFiles = (req, res, next) => {
  success(res, true, 200, "File upload successfully", req.file.filename);
};

module.exports = {
  createPost,
  getPosts,
  postLike,
  singlePost,
  commentPost,
  deletePost,
  updatePost,
  uploadFiles,
};
