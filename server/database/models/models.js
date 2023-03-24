const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  friendsId: [{ type: String }],
  profile_img: { type: String, default: "default-image" },
  profile_image_cloudinary_id: String,
});

const chatSchema = new mongoose.Schema(
  {
    message: String,
    users: Array,
    senderID: String,
    timeSent: String,
    deleted: { type: Boolean, default: false },
    edited: { type: Boolean, default: false },
    messageType: { type: String, default: "text" },
    messageUrl: { type: String, default: "" },
    messageCloudinaryId: { type: String, default: "" },
    messageExtension: { type: String, default: "" },
    messageName: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

const groupSchema = new mongoose.Schema({
  groupName: String,
  participantsId: [{ type: String, ref: "User" }],
  adminsId: Array,
  groupProfileImage: { type: String, default: "default-image" },
  profile_image_cloudinary_id: String,
});

const User = mongoose.model("User", userSchema);
const Chat = mongoose.model("Chat", chatSchema);
const Group = mongoose.model("Group", groupSchema);

module.exports = {
  User,
  Chat,
  Group,
};
