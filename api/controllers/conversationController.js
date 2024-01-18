const asyncHandler = require('express-async-handler')

const Conversation = require('../models/conversation')

exports.createConversation = asyncHandler(async(req, res, next) => {
    res.json('')
})