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
const Group = require("./database/models/models").Group;
const { verifyHeaderToken, formatDateTime } = require("./utils/functions");
const jwtSecretKey = process.env.JWT_SECRET_KEY;
const upload = require("./utils/multer");
const uploadMultipleFiles = require("./utils/multerMultipleFiles");

const cloudinary = require("./utils/cloudinary");
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
 * endpoint for uploading profile images
 */
app.post("/users/upload", upload.single("image"), async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      // eager: [{ width: 147, height: 147, crop: "crop" }],
      aspect_ratio: "2.0",
      crop: "crop",
    });
    const user = await User.findOne({ _id: req.body.userID });
    user.profile_img = result.secure_url;
    user.profile_image_cloudinary_id = result.public_id;
    user.save();
    res.send({ upadated: "details updated" });
  } catch (err) {
    res.send({ error: "something went wrong" });
    console.log(err);
  }
});

async function uploadFileToCloudinary(file) {
  const options = { resource_type: "auto" };
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(file.path, options, (error, result) => {
      if (error) {
        reject(
          `The file ${file.originalname} could not be uploaded, please try again`
        );
      } else {
        resolve(result);
      }
    });
  });
}

app.post(
  "/users/uploadMultipleFiles",
  uploadMultipleFiles,
  async (req, res) => {
    const { to, from } = req.body;

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

    let errors = [];
    let uploadedFiles = [];
    for (let i = 0; i < req.files.length; i++) {
      let file = req.files[i];
      try {
        const result = await uploadFileToCloudinary(file);
        let messageType;
        if (result.resource_type === "image") {
          messageType = "image";
        } else if (result.resource_type === "video") {
          if (result.is_audio) {
            messageType = "audio";
          } else {
            messageType = "video";
          }
        } else {
          messageType = "raw";
        }
        try {
          const newChat = new Chat({
            users: [from, to],
            senderID: from,
            timeSent: formatDateTime(new Date()),
            messageType,
            messageUrl: result.secure_url,
            messageCloudinaryId: result.public_id,
            messageExtension: result.format,
            messageName: file.originalname,
          });

          const newChatDoc = await new Promise((resolve, reject) => {
            newChat.save((err, doc) => {
              if (err) reject(err);
              else resolve(doc);
            });
          });
          uploadedFiles.push(newChatDoc);
        } catch (error) {
          errors.push(error);
        }
      } catch (error) {
        errors.push(error);
      }
    }
    res.send({ uploadedFiles, errors });
  }
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
 * the login endpoint * recieves - username - password
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

app.get("/users/deleteMessage/:messageId", verifyHeaderToken, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, async (err) => {
    if (err) {
      res.send({ tokenError: "invalid or expired token" });
    } else {
      try {
        const updatedDoc = await Chat.findOneAndUpdate(
          { _id: req.params.messageId },
          { message: null, deleted: true },
          { new: true }
        );
        if (!updatedDoc) {
          res.send({ notFound: "document not found" });
        } else {
          res.send({ success: true, updatedDoc });
        }
      } catch (error) {
        res.send({ error: "something went wrong please try again" });
      }
    }
  });
});

app.put("/users/editMessage/:messageId", verifyHeaderToken, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, async (err) => {
    if (err) {
      res.send({ tokenError: "invalid or expired token" });
    } else {
      const { message } = req.body;
      try {
        const updatedMessageDoc = await Chat.findByIdAndUpdate(
          { _id: req.params.messageId },
          { message, edited: true },
          { new: true }
        );
        if (!updatedMessageDoc) {
          res.send({ notFound: "document not found" });
        } else {
          res.send({ messageEdited: true, updatedMessageDoc });
        }
      } catch (error) {
        res.send({ error: "something went wrong please try again" });
      }
    }
  });
});

app.get("/users/all-users", verifyHeaderToken, async (req, res) => {
  jwt.verify(req.token, jwtSecretKey, async (err) => {
    if (err) {
      res.send({ tokenError: "Invalid request token" });
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

/**
 * fetches users details
 */
app.get("/users/:userID", verifyHeaderToken, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, async (err) => {
    if (err) {
      res.send({ tokenError: "invalid request token" });
    } else {
      try {
        const user = await User.findOne({ _id: req.params.userID });
        if (user) {
          res.send(user);
        } else {
          //if this happens then a camel'll pass through the eye of a needle
        }
      } catch (err) {
        res.send({ error: "something went wrong" });
      }
    }
  });
});

app.post("/users/createGroup", verifyHeaderToken, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, async (err) => {
    if (err) {
      res.send({ tokenError: "Invalid request token" });
    } else {
      const { adminId, groupName, participantsId } = req.body;
      const newGroup = new Group({
        groupName,
        participantsId,
        adminsId: adminId,
      });
      newGroup.save((err, doc) => {
        if (err) {
          res.send({ serverError: "Something went wrong, please try again" });
        } else {
          res.send(doc);
        }
      });
    }
  });
});

app.get("/users/:userId/groups", verifyHeaderToken, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, async (err) => {
    if (err) {
      res.send({ tokenError: "Invalid request token" });
    } else {
      const userId = req.params.userId;
      Group.find({ participantsId: userId })
        .populate({ path: "participantsId", select: "-password" })
        .exec((err, groups) => {
          if (err) {
            res.send({
              serverError:
                "Something went wrong at the server, please try again",
            });
          } else {
            res.send({ groups });
          }
        });
    }
  });
});

app.post("/users/update-user", verifyHeaderToken, (req, res) => {
  jwt.verify(req.token, jwtSecretKey, async (err) => {
    if (err) {
      res.send({ tokenError: "invalid rerquest token" });
    } else {
      const { username, email, password, userID } = req.body;
      let existErrors = [];
      if (username.changed) {
        const usernameExist = await User.findOne({ username: username.value });
        if (usernameExist) {
          existErrors.push("username already exist");
        }
      }
      if (email.changed) {
        const emailExist = await User.findOne({ email: email.value });
        if (emailExist) {
          existErrors.push("email already exist");
        }
      }
      if (existErrors.length > 0) {
        res.send({ existErrors });
      } else {
        const user = await User.findOne({ _id: userID });
        if (username.changed) {
          user.username = username.value;
        }
        if (email.changed) {
          user.email = email.value;
        }
        if (password.changed) {
          user.password = password.value;
        }
        user.save((err, doc) => {
          if (err) {
            res.send({ serverError: "something went wrong" });
          } else {
            jwt.sign(
              { username: doc.username },
              jwtSecretKey,
              { expiresIn: "1h" },
              (err, token) => {
                if (err) {
                  res.send({ serverError: "something went wrong" });
                } else {
                  res.send({
                    userID: doc._id,
                    username: doc.username,
                    token,
                  });
                }
              }
            );
          }
        });
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
  socket.on("delete-message", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("recieve-deleted-message", data);
    }
  });
  socket.on("messageEdited", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("recieveEditedMessage", data);
    }
  });
  socket.on("sendFileMessage", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("recieveFileMessage", data);
    }
  });
  socket.on("exit", (data) => {
    onlineUsers.delete(data);
  });
});

server.listen(3001, () => {
  console.log("server running on port 3001");
});
