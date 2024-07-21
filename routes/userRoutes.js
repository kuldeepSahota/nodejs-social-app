const express = require("express");
const auth = require("../middleware/authMiddleware");
const { followUnfollow, followersAndFollowing } = require("../controllers/usersController");
const router = express.Router();

router.post("/follow", auth, followUnfollow);
router.get("/follower-following", auth, followersAndFollowing);

module.exports = router;
