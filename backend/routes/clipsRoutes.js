const express = require("express");
const router = express.Router();
const clipController = require("../controller/clipsController.js");

// Create a new post video
router.post("/video/create", clipController.createClip);

// Get all posts
router.get("/video/get", clipController.getAllClipVideos);

// Delete a video post by ID
router.post("/video/delete", clipController.deleteClip);

// Get a single post by ID
router.get("/get/:id", clipController.getClipById);

// Update a post by ID
router.put("/update/:id", clipController.updateClips);

// Delete a post by ID
router.delete("/delete/:id", clipController.deleteClip);

// Create a new reaction for a post
router.post("/video/reaction/create", clipController.createClipReaction);

// delete reaction of a post
router.post("/video/reaction/delete", clipController.deleteClipReaction);

// Create a new comment for a post
router.post("/comment/create", clipController.createClipComment);

// Create a new share for a post
router.post("/share/create", clipController.createShare);

// Get all reactions for a post
router.get("/reaction/get", clipController.getAllClipReactions);

// Get all comments for a post
router.get("/comment/get", clipController.getAllClipComments);

// Get all shares for a post
router.get("/share/get", clipController.getAllShares);

// Update a reaction by ID
router.put("/reaction/update", clipController.updateReaction);

// Update a comment by ID
router.put("/comment/update", clipController.updateComment);

// Update a share by ID
router.put("/share/update", clipController.updateShare);

// Delete a comment by ID
router.delete("/comment/delete", clipController.deleteComment);

// Delete a share by ID
router.delete("/share/delete", clipController.deleteShare);

module.exports = router;
