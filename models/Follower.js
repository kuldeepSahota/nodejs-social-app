const mongoose = require("mongoose");

const followerSchema = new mongoose.Schema(
  {
    toUserId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    fromUserId: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Follower", followerSchema);
