const express = require("express");
const router = express.Router();
const {
  sendNewMessage,
  sendRequest,
  acceptRequest,
  getUserProfileColor,
  getUserProfileColors,
} = require("../controllers/userController");

// Route definitions
router.get("/new-message/:userId", sendNewMessage);
router.get("/send-request/:userId", sendRequest);
router.get("/accept-request/:userId", acceptRequest);
router.get("/get-user-profile-color/:id", getUserProfileColor);
router.post("/get-user-profile-colors", getUserProfileColors);

module.exports = router;
