const express = require("express");
const router = express.Router();
const postController = require("../controller/postController.js");

// Create a new post video
router.post("/video/create", postController.postVideo);

// Get all posts
router.get("/video/get", postController.getAllPostVideos);

// Get trending posts
router.get("/video/trending/get", postController.getTrendingPosts);

// Get all current user following post
router.post("/video/following/get", postController.getFollowingPosts);

// Delete a video post by ID
router.post("/video/delete", postController.deletePost);

// Get a single post by ID
router.get("/get/:id", postController.getPostById);

// Update a post by ID
router.put("/update/:id", postController.updatePost);

// Delete a post by ID
router.delete("/delete/:id", postController.deletePost);

// Create a new reaction for a post
router.post("/video/reaction/create", postController.createVideoReaction);

// delete reaction of a post
router.post("/video/reaction/delete", postController.deleteVideoReaction);

// Create a new comment for a post
router.post("/comment/create", postController.createComment);

// Create a new share for a post
router.post("/share/create", postController.createShare);

// Get all reactions for a post
router.get("/reaction/get", postController.getAllReactions);

// Get all comments for a post
router.get("/comment/get", postController.getAllComments);

// Get all shares for a post
router.get("/share/get", postController.getAllShares);

// Update a reaction by ID
router.put("/reaction/update", postController.updateReaction);

// Update a comment by ID
router.put("/comment/update", postController.updateComment);

// Update a share by ID
router.put("/share/update", postController.updateShare);

// Delete a comment by ID
router.delete("/comment/delete", postController.deleteComment);

// Delete a share by ID
router.delete("/share/delete", postController.deleteShare);

router.post("/bookmark/create", postController.addBookmark);
router.post("/bookmark/get", postController.getUserBookmark);
router.delete("/bookmark/remove", postController.removeBookmark);

module.exports = router;
