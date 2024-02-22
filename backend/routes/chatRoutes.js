const express = require("express");
const {
  startChatSession,
  createChatMessage,
  getUserMessages,
} = require("../controller/chatController");

const router = express.Router();

// Chat routes
router.post("/session/start", startChatSession);
router.post("/init", createChatMessage);
router.post("/messages/get", getUserMessages);

module.exports = router;
