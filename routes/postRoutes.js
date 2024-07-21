const express = require("express");
const router = express.Router();
const { createPost, getPosts, postLike, singlePost, commentPost, deletePost, updatePost, uploadFiles } = require("../controllers/postController");
const auth = require("../middleware/authMiddleware");
const { upload } = require("../utils/uploadFile");
const uploadFile = require("../middleware/uploadFiles");

router.post("/create", auth, createPost);
router.get("/list", auth, getPosts);
router.post("/like", auth, postLike);
router.get("/details/:postId", auth, singlePost);
router.post("/comment", auth, commentPost);
router.delete("/delete/:postId", auth, deletePost);
router.put("/update/:postId", auth, updatePost);
router.post("/upload",  uploadFile,uploadFiles);

module.exports = router;
