require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("./database/connection");
const User = require("./database/models/models").User;

const jwtSecretKey = process.env.JWT_SECRET_KEY;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: ["http://localhost:3000", "https://chat-app-api-ogbx.onrender.com"],
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

io.on("connection", (socket) => {
  console.log("user connected");
});

server.listen(3001, () => {
  console.log("server running on port 3001");
});
