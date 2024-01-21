const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  timestamp: {
    type: Date,
    required: true,
    default: Date.now()
  },
  content: {
    type: Schema.Types.Mixed,
    required: true
  },
  sender: {type: Schema.Types.ObjectId, ref: 'User', required: true}
})

module.exports = mongoose.model('Message', messageSchema)