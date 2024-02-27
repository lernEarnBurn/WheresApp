const asyncHandler = require('express-async-handler')

const Message = require('../models/message')
const Conversation = require('../models/conversation')
const Image = require('../models/image');


exports.createMessageImage = asyncHandler(async (req, res, next) => {
    try {

        if (!req.file) {
            return res.status(400).json({ error: 'No image file provided.' });
        }

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



        const updatedConversation = await Conversation.findByIdAndUpdate(
            req.params.conversationId,
            {
                $push: { messages: message._id },
                lastMessage: 'image'
            },
            { new: true }
        ).populate('users').populate('lastMessage').populate('messages');

        if (!updatedConversation) {
            return res.status(404).json({ error: 'Conversation not found.' });
        }
        
        await image.save();
        await message.save();

        res.json({ message: message, conversation: updatedConversation });
    } catch (err) {
        console.error("Error details:", err);
        res.status(500).json({ error: 'Server Error', details: err.message });
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