const mongoose = require('mongoose')
const Schema = mongoose.Schema

const messageSchema = new Schema({
  timestamp: {
    type: Date,
    required: true
  },
  content: {
    type: Schema.Types.Mixed,
    required: true
  }
})

module.exports = mongoose.model('Message', messageSchema)