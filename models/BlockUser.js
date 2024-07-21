const mongoose = require("mongoose");

const blockUserSchema = new mongoose.Schema(
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

module.exports = mongoose.model("BlockUser", blockUserSchema);
