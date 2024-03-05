const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single("image");

const convController = require("../controllers/conversationController");
const messageController = require("../controllers/messageController");
const userController = require("../controllers/userController");

require("dotenv").config();

const ensureAuthenticated = (req, res, next) => {
  const authHeader = req.header("Authorization");

  const [bearer, token] = authHeader.split(" ");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized - Missing Token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.user = decoded.user;

    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized - Invalid Token" });
  }
};

router.post(
  "/user/:userId/conversations",
  ensureAuthenticated,
  convController.createConversation,
);

router.get(
  "/user/:userId/conversations/:conversationId",
  ensureAuthenticated,
  convController.getSingleConversation,
);

router.get(
  "/user/:userId/conversations",
  ensureAuthenticated,
  convController.getAllConversations,
);

router.post(
  "/user/:userId/conversations/:conversationId/message/image",
  ensureAuthenticated,
  upload,
  messageController.createMessageImage,
);

router.post(
  "/user/:userId/conversations/:conversationId/message/text",
  ensureAuthenticated,
  messageController.createMessageText,
);

router.post("/user", ensureAuthenticated, userController.searchBar);

router.post(
  "/user/:userId/username",
  ensureAuthenticated,
  userController.editUsername,
);

router.post(
  "/user/:userId/description",
  ensureAuthenticated,
  userController.editDescription,
);

router.post(
  "/user/:userId/profilePic",
  ensureAuthenticated,
  upload,
  userController.setProfilePic,
);

router.get(
  "/user/:userId/profilePic/:picId",
  ensureAuthenticated,
  upload,
  userController.getProfilePic,
);

module.exports = router;
