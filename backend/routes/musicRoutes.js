const express = require("express");
const router = express.Router();
const postController = require("../controller/postController.js");
const musicController = require("../controller/musicController.js");

// Get all music
router.get("/get/all", musicController.getAllMusic);

module.exports = router;
