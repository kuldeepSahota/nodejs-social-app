const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    files: [{ type: String, default: "" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
