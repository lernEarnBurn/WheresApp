const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).single('content');

const asyncHandler = require('express-async-handler')

const Message = require('../models/message')
const Conversation = require('../models/conversation')
const Image = require('../models/image')

//need to figure otu why not responding with code or outputing message obj even tho seemingly completing this
exports.createMessage = asyncHandler(async (req, res, next) => {
    const isImageUpload = req.headers['content-type'] && req.headers['content-type'].startsWith('multipart/form-data');

    if (isImageUpload) {
        console.log('ran upload')
        upload(req, res, async function (err) {
            if (err instanceof multer.MulterError) {
                console.log('Multer error:', err.message);
                return res.status(400).json({ error: 'Bad Request' });
            } else if (err) {
                console.log('Unknown error during file upload:', err);
                return res.status(500).json({ error: 'Server Error' });
            }

            try {
                const image = new Image({
                    name: req.file.originalname,
                    image: {
                        data: req.file.buffer,
                        contentType: req.file.mimetype,
                    },
                });

                await image.save();

                const message = new Message({
                    content: image._id,
                    sender: req.params.userId,
                });

                await Conversation.findByIdAndUpdate(
                    req.params.conversationId,
                    { $push: { messages: message._id } },
                    { new: true }
                );

                await message.save();
                res.json(message);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Server Error' });
            }
        });
    } else {
        try {
            const message = new Message({
                content: {
                    type: 'text',
                    text: req.body.content, 
                },
                sender: req.params.userId,
            });

            await Conversation.findByIdAndUpdate(
                req.params.conversationId,
                { $push: { messages: message._id } },
                { new: true }
            );

            await message.save();
            res.json(message);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server Error' });
        }
    }
});
