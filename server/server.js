require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "https://react-project-chat-app.netlify.app",
    ],
  },
});

const jwt = require("jsonwebtoken");
require("./database/connection");
const User = require("./database/models/models").User;
const Chat = require("./database/models/models").Chat;
const { verifyHeaderToken, formatDateTime } = require("./utils/functions");

const jwtSecretKey = process.env.JWT_SECRET_KEY;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://react-project-chat-app.netlify.app",
    ],
  })
);

/**
 * the sign up endpoint
 * recieves - username, - email, - password
 * returns the details of the registered user if there's no
 * error otherwise it returns an array of error
 */

app.post("/users/signup", async (req, res) => {
  let errors = [];
  // the user details from the request
  const { username, email, password } = req.body;

  //check if the user's email and password exist
  const existingEmailCount = await User.countDocuments({ email });
  const existingUsernameCount = await User.countDocuments({ username });

  if (existingEmailCount > 0) {
    errors.push({
      errorType: "emailExist",
      errorMessage: "Email already exist",
    });
  }
  if (existingUsernameCount > 0) {
    errors.push({
      errorType: "usernameExist",
      errorMessage: "Username already exist",
    });
  }

  if (errors.length === 0) {
    //no errors, username and email do not exist
    jwt.sign({ username }, jwtSecretKey, { expiresIn: "1h" }, (err, token) => {
      if (!err) {
        //saving the user
        const newUser = new User({
          username,
          email,
          password,
        });
        newUser.save((err, newUserDoc) => {
          if (err) {
            console.log(err);
            res.send({
              error: [
                {
                  errorType: "serverError",
                  errorMessage: "Something went wrong, please try again",
                },
              ],
            });
          } else {
            res.send({
              userID: newUserDoc._id,
              username: newUserDoc.username,
              token,
            });
          }
        });
      } else {
        res.send({
          error: [
            {
              errorType: "serverError",
              errorMessage: "Something went wrong, please try again",
            },
          ],
        });
      }
    });
  } else {
    //username or email exist
    res.send({
      error: errors,
    });
  }
});

/**
 * the login endpoint
 * recieves - username - password
 *
 */

app.post("/users/login", async (req, res) => {
  const { username, password } = req.body;

  const userDetails = await User.findOne({ username });
  if (userDetails) {
    if (userDetails.password === password) {
      jwt.sign(
        { username },
        jwtSecretKey,
        { expiresIn: "1h" },
        (err, token) => {
          if (!err) {
            res.send({
              userID: userDetails._id,
              username: userDetails.username,
              token,
            });
          } else {
            res.send({
              error: "Something went wrong",
            });
          }
        }
      );
    } else {
      res.send({
        error: "invalid email or password",
      });
    }
  } else {
    res.send({
      error: "Invalid username or password",
    });
  }
});

/**
 *
 * recieves userID and sends back the all the user's frinds details
 *
 */
app.get("/users/:userID/friends", verifyHeaderToken, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, async (err) => {
    if (err) {
      //the request token has expired
      res.send({ tokenError: "invalid request token" });
    } else {
      try {
        const userDetails = await User.findOne({ _id: req.params.userID });

        if (userDetails.friendsId.length > 0) {
          //the user has friends
          const friendsIds = userDetails.friendsId;
          const friendsDetails = await User.find(
            { _id: { $in: friendsIds } },
            { password: 0, friendsId: 0 } //wont return these fields
          );
          res.send(friendsDetails);
        } else {
          res.send([]);
        }
      } catch (error) {
        console.log("error at the user details endpoint", error);
        res.send({ error: "something went wrong" });
      }
    }
  });
});

/**
 * send message endpoint
 * recieves message, sender's id and the recievers Id
 * saves the details into the database with a timestamp
 * sends back the saved chat after saving
 */
app.post("/users/sendMessage", verifyHeaderToken, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, async (err) => {
    if (err) {
      res.send({ error: "invalid request token" });
    } else {
      const { to, from, message } = req.body;
      const sender = await User.findOne({ _id: from });
      const reciever = await User.findOne({ _id: to });

      if (sender.friendsId.indexOf(reciever._id) === -1) {
        sender.friendsId = [...sender.friendsId, to];
        sender.save();
      }
      if (reciever.friendsId.indexOf(sender._id) === -1) {
        reciever.friendsId = [...reciever.friendsId, from];
        reciever.save();
      }
      const newChat = new Chat({
        message,
        users: [from, to],
        senderID: from,
        timeSent: formatDateTime(new Date()),
      });
      newChat.save((err, newChatDoc) => {
        if (err) {
          res.send({ error: "Something went wrong please try again" });
        } else {
          res.send(newChatDoc);
        }
      });
    }
  });
});

/**
 * the get message endpoint
 * retrieves messages between two specified users
 */
app.post("/users/getMessages", verifyHeaderToken, async (req, res) => {
  jwt.verify(req.token, jwtSecretKey, async (err) => {
    if (err) {
      res.send({ error: "Invalid request token" });
    } else {
      const { from, to } = req.body;
      try {
        const messages = await Chat.find({ users: { $all: [from, to] } });
        res.send(messages);
      } catch (error) {
        console.log(error);
        res.send({ error: "something went wrong please try again" });
      }
    }
  });
});

app.get("/users/all-users", verifyHeaderToken, async (req, res) => {
  jwt.verify(req.token, jwtSecretKey, async (err) => {
    if (err) {
      res.send({ error: "Invalid request token" });
    } else {
      try {
        const allUsers = await User.find({}, { password: 0, friendsId: 0 });
        res.send(allUsers);
      } catch (err) {
        console.log(err);
        res.send({ error: "something went wrong" });
      }
    }
  });
});

let onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userID) => {
    onlineUsers.set(userID, socket.id);
  });
  socket.on("send-message", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("recieve-message", data);
    }
  });
});

server.listen(3001, () => {
  console.log("server running on port 3001");
});
