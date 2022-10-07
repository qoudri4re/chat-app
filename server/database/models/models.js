const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  friendsId: [{ type: String }],
  onlineStatus: String,
});

const User = mongoose.model("User", userSchema);

module.exports = {
  User,
};
