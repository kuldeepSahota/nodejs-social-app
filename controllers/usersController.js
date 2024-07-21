const { default: mongoose } = require("mongoose");
const Follower = require("../models/Follower");
const { success, error } = require("../utils/helpers");
const BlockUser = require("../models/BlockUser");
const User = require("../models/User");


const followUnfollow = async (req, res) => {
  try {
    let payload = {
      toUserId: req.user.id,
      fromUserId: req.body.fromUserId,
      status: req.body.status,
    };

    if (payload.status) {
      let follower = await Follower.create(payload);
      if (follower) {
        return success(res, true, 200, "Followed successfully", follower);
      } else {
        return success(res, false, 200, "Something went wrong");
      }
    } else {
      let follower = await Follower.findOneAndDelete({
        toUserId: req.user.id,
        fromUserId: req.body.fromUserId,
      });
      if (follower) {
        return success(res, true, 200, "Unfollowed successfully", follower);
      } else {
        return success(res, false, 200, "Something went wrong");
      }
    }
  } catch (err) {
    return error(500, "Internal server error");
  }
};


const blockUnblock = async (req, res) => {
  try {
    let payload = {
      toUserId: req.user.id,
      fromUserId: req.body.fromUserId,
      status: req.body.status,
    };
    if (payload.status) {
      let blockUser = await BlockUser.create(payload);
      if (blockUser) {
        return success(res, true, 200, "User blocked successfully", blockUser);
      } else {
        return success(res, false, 200, "Something went wrong");
      }
    } else {
      let unblock = await BlockUser.findOneAndDelete({
        toUserId: req.user.id,
        fromUserId: req.body.fromUserId,
      });
      if (unblock) {
        return success(res, true, 200, "User un-blocked successfully", unblock);
      } else {
        return success(res, false, 200, "Something went wrong");
      }
    }
  } catch (err) {
    return error(500, "Internal server error");
  }
};

const followersAndFollowing = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        // Aggregation pipeline for followers
        const followersPipeline = [
            { $match: { toUserId: userId } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'fromUserId',
                    foreignField: '_id',
                    as: 'followerDetails'
                }
            },
            { $unwind: '$followerDetails' },
            { $replaceRoot: { newRoot: '$followerDetails' } },
            { $project: { _id: 1, username: 1, email: 1 } }
        ];

        // Aggregation pipeline for following
        const followingPipeline = [
            { $match: { fromUserId: userId } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'toUserId',
                    foreignField: '_id',
                    as: 'followingDetails'
                }
            },
            { $unwind: '$followingDetails' },
            { $replaceRoot: { newRoot: '$followingDetails' } },
            { $project: { _id: 1, username: 1, email: 1 } }
        ];

        // Execute the aggregation pipelines
        const [followers, following] = await Promise.all([
            Follower.aggregate(followersPipeline),
            Follower.aggregate(followingPipeline)
        ]);

        // Combine results and send response
        return success(res, true, 200, "Followers and Following fetched successfully", {
            followers,
            following
        });
    } catch (err) {
        console.error('Error fetching followers and following:', err);
        return error(res, 500, "Internal server error");
    }
};



module.exports = {
  followUnfollow,
  blockUnblock,
  followersAndFollowing
};
