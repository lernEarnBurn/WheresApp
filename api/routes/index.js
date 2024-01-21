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



router.post('/user/:userId/conversations', ensureAuthenticated, convController.createConversation)

router.get('/user/:userId/conversations/:conversationId', ensureAuthenticated, convController.getSingleConversation)

router.get('/user/:userId', ensureAuthenticated, convController.getAllConversations)

router.post('/user/:userId/conversations/:conversationId/message', ensureAuthenticated, messageController.createMessage)

//searchbar
router.get('/user', ensureAuthenticated, asyncHandler(async(req, res, next) => {
  res.json('')
}))

module.exports = router;
