const express = require("express");
const router = express.Router();
const storyController = require("../controller/storyController.js");

// Create a new post story
router.post("/story/create", storyController.postStory);

// Get user stories
router.post("/story/get-user", storyController.getUserAllStories);

// Get all stories
router.get("/story/get", storyController.getAllStories);

// Get all following stories
router.post("/story/following/get", storyController.getFollowingStories);

// Get all current user stories
router.post("/story/user/get", storyController.getCurrentUserStories);

// Delete a story post by ID
router.post("/story/delete", storyController.deletePost);

// Get a single post by ID
router.get("/get/:id", storyController.getPostById);

// Update a post by ID
router.put("/update/:id", storyController.updatePost);

// Delete a post by ID
router.delete("/delete/:id", storyController.deletePost);

// Create a new reaction for a post
router.post("/story/reaction/create", storyController.createVideoReaction);

// delete reaction of a post
router.post("/story/reaction/delete", storyController.deleteVideoReaction);

// Create a new comment for a post
router.post("/comment/create", storyController.createComment);

// Create a new share for a post
router.post("/share/create", storyController.createShare);

// Get all reactions for a post
router.get("/reaction/get", storyController.getAllReactions);

// Get all comments for a post
router.get("/comment/get", storyController.getAllComments);

// Get all shares for a post
router.get("/share/get", storyController.getAllShares);

// Update a reaction by ID
router.put("/reaction/update", storyController.updateReaction);

// Update a comment by ID
router.put("/comment/update", storyController.updateComment);

// Update a share by ID
router.put("/share/update", storyController.updateShare);

// Delete a comment by ID
router.delete("/comment/delete", storyController.deleteComment);

// Delete a share by ID
router.delete("/share/delete", storyController.deleteShare);

module.exports = router;
