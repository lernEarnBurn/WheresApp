const asyncHandler = require('express-async-handler')

const Conversation = require('../models/conversation')
const Image = require('../models/image')

const Mongoose = require('mongoose')

exports.createConversation = asyncHandler(async(req, res, next) => {
    try{
        const conversation = new Conversation({
            users: [req.params.userId, req.body.recipient],
        })

        await conversation.save()
        const populatedConversation = await Conversation.findById(conversation._id).populate('users').populate({
            path: 'users',
            populate: {
              path: 'profilePic',
              model: 'Image'
            }
          });

        populatedConversation.users[0] = populatedConversation.users[1]


        res.json(populatedConversation);


    } catch(err){
        console.log(err)
        res.status(500).json({error: 'Server Error.'})
    }
})

//may not need
exports.getSingleConversation = asyncHandler(async(req, res, next) => {
    try{
        const conversation = await Conversation.findById(req.params.conversationId);

        if (!conversation) {
            return res.status(404).json({ error: 'Conversation not found' });
        }

        res.json(conversation)
    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Server Error.'})        
    }
})

exports.getAllConversations = asyncHandler(async(req, res, next) => {
    try {
        const conversations = await Conversation.find({ users: req.params.userId })
                                                        .populate('lastMessage')
                                                        .populate('messages')
                                                        .populate({
                                                          path: 'users',
                                                          populate: {
                                                            path: 'profilePic',
                                                            model: 'Image'
                                                          }
                                                        });

        for (let conversation of conversations) {
          for (let message of conversation.messages) {
            if (message.content.type === 'image') { 
              message.content.image = await Image.findById(message.content.image);
              
            }
          }
        }
        res.json(conversations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})