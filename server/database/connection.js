require("dotenv").config();
const mongoose = require("mongoose");
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const cluster = process.env.CLUSTER;
const dbname = process.env.DB_NAME;

let connectionUrl = "";
if (process.env.ENVIRONMENT === "development") {
  connectionUrl = "mongodb://localhost:27017/chat-app";
} else {
  connectionUrl = `mongodb://${username}:${password}@${cluster}.mongodb.net:27017,ac-iiwqc6d-shard-00-01.ntnbdr7.mongodb.net:27017,ac-iiwqc6d-shard-00-02.ntnbdr7.mongodb.net:27017/${dbname}?ssl=true&replicaSet=atlas-sgkixf-shard-0&authSource=admin&retryWrites=true&w=majority`;
}
//online DB
mongoose.connect(connectionUrl, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log("database connection succesful");
  }
});

//local DB URL
//"mongodb://localhost:27017/chat-app";
