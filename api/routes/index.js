const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler')

const convController = require('../controllers/conversationController')
const messageController = require('../controllers/messageController')

const User = require('../models/user')

const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};



router.post('/user/:userId/conversations', ensureAuthenticated, convController.createConversation)

router.get('/user/:userId/conversations/:conversationId', ensureAuthenticated, convController.getSingleConversation)

router.get('/user/:userId/conversations', ensureAuthenticated, convController.getAllConversations)

router.post('/user/:userId/conversations/:conversationId/message', ensureAuthenticated, messageController.createMessage)

router.get('/user', ensureAuthenticated, asyncHandler(async(req, res, next) => {
  try{
     const searchedUsers = await User.find({ username: { $regex: `^${req.body.searchQuery}`, $options: 'i' } });

      if (!searchedUsers) {
        return res.status(404).json({ error: 'No Users Found' });
    }

    res.json(searchedUsers)
  } catch(err){
    console.log(err)
    res.status(500).json({error: 'Server Error.'})
  }
}))

module.exports = router;
