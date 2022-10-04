const mongoose = require("mongoose");
// mongoose.set("useNewUrlParser", true);
mongoose.connect("mongodb://localhost:27017/chat-app", (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("database connection succesful");
  }
});
