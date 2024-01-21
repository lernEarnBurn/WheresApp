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
        res.status(500).json({error: err})
        
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
        res.status(500).json({error: err})
        
    }
})

exports.getAllConversations = asyncHandler(async(req, res, next) => {
    res.json('')
})