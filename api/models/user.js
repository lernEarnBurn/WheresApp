const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  description: { type: String, required: true, default: 'Hello I am here using Wheresapp.' },
  profilePic: { type: Schema.Types.ObjectId, ref: 'Image', default: null }
});

module.exports = mongoose.model("User", userSchema);