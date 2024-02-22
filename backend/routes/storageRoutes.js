const express = require("express");
const multer = require("multer");
const router = express.Router();
const storageController = require("../controller/storageController.js");
const upload = multer({ dest: "../backend/uploads/" });

// Upload Video to AWS S3
router.post(
  "/video/upload",
  upload.single("file"),
  storageController.uploadVideo
);
// Upload Image to AWS S3
router.post(
  "/image/upload",
  upload.single("file"),
  storageController.uploadImage
);

module.exports = router;
