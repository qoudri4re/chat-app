const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  friendsId: [{ type: String }],
});

const chatSchema = new mongoose.Schema(
  {
    message: String,
    users: Array,
    senderID: String,
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
const Chat = mongoose.model("Chat", chatSchema);
module.exports = {
  User,
  Chat,
};
