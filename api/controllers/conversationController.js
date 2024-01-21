const asyncHandler = require('express-async-handler')

const Conversation = require('../models/conversation')

exports.createConversation = asyncHandler(async(req, res, next) => {
    try{
        const conversation = new Conversation({
            users: [req.params.userId, req.body.recipient]
        })

        await conversation.save()

        res.json(conversation)
    } catch(err){
        console.log(err)
        res.status(500).json({error: 'Server Error.'})
    }
})

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
        const conversations = await Conversation.find({ users: req.params.userId });

        res.json(conversations);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})