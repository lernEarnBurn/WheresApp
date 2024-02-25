const asyncHandler = require('express-async-handler')

const Message = require('../models/message')
const Conversation = require('../models/conversation')
const Image = require('../models/image')

exports.createMessageImage = asyncHandler(async (req, res, next) => {
    //need to do image sending
    try {
        const image = new Image({
            name: req.file.originalname,
            image: {
                data: req.file.buffer,
                contentType: req.file.mimetype,
            },
        });

        

        const message = new Message({
            content: {
                type: 'image',
                image: image._id,
            },
            sender: req.params.userId,
        });

        //this order is bec weird res bug
        res.json(message)
        await message.save();
        //note: there is a size limit on images of 15mb
        await image.save();

        const updatedConversation = await Conversation.findByIdAndUpdate(
            req.params.conversationId,
            { 
                $push: { messages: message._id },
                lastMessage: 'image' 
            },
            { new: true }
        ).populate('users').populate('lastMessage').populate('messages')        

        
    } catch (err) {
        console.error(err);
        res.status(err.status || 500).json({ error: err.error || 'Server Error' });
    }
});


exports.createMessageText = asyncHandler(async(req, res, next) => {
    try {
        const message = new Message({
            content: {
                type: 'text',
                text: req.body.content, 
            },
            sender: req.params.userId,
        });

        const updatedConversation = await Conversation.findByIdAndUpdate(
            req.params.conversationId,
            {
              $push: { messages: message._id },
              lastMessage: req.body.content, 
            },
            { new: true }
          ).populate('users').populate('lastMessage').populate('messages')
          

        await message.save();
        res.json({ message: message, conversation: updatedConversation });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server Error' });
    }
})