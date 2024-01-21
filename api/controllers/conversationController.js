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
        res.status(500)
        console.log(err)
    }
})

exports.getSingleConversation = asyncHandler(async(req, res, next) => {
    res.json('')
})

exports.getAllConversations = asyncHandler(async(req, res, next) => {
    res.json('')
})