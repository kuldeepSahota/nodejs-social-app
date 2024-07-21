const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
    },
    comment: {
      type: String,
    },
    parentId:{
        type: mongoose.Schema.ObjectId,
        ref: "Comment",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", CommentSchema);
