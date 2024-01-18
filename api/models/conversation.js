const mongoose = require('mongoose')
const Schema = mongoose.Schema

const conversationSchema = new Schema({
  users: [{
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }, {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }],

  messages: [{type: Schema.Types.ObjectId, ref: "Message"}]
})

module.exports = mongoose.model("Conversation", conversationSchema);