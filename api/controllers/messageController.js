const asyncHandler = require('express-async-handler')

const Message = require('../models/message')

exports.createMessage = asyncHandler(async(req, res, next) => {
    res.json('')
})