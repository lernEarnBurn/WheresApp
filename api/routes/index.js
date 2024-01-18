const express = require('express');
const router = express.Router();

const convController = require('../controllers/conversationController')
const messageController = require('../controllers/messageController')

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};


/*
need to map out routes better.
Remaining Routes:
  -searchbar for users to start convo with
  -get conversations that a person has
  -get messages in a single conversation
*/

router.post('/conversations', ensureAuthenticated, convController.createConversation)

router.post('/conversations/:conversationId', ensureAuthenticated, messageController.createMessage)

module.exports = router;
