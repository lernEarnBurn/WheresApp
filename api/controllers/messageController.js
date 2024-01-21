const asyncHandler = require('express-async-handler')

const Message = require('../models/message')
const Conversation = require('../models/conversation')

exports.createMessage = asyncHandler(async(req, res, next) => {
    try{
        const message = new Message({
            content: req.body.content,
            sender: req.params.userId
        })

        await Conversation.findByIdAndUpdate(
            req.params.conversationId,
            { $push: { messages: message._id } },
            { new: true } 
        );
        
        await message.save()
        res.json(message)
    } catch(err){
        console.log(err)
        res.status(500).json({error: 'Server Error.'})

    }
})