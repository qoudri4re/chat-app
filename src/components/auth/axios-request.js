import axios from "axios";
//live urls
// 1- https://chat-app-api.up.railway.app/users fastest
// 2 - https://chat-app-api-ogbx.onrender.com/users slow

// BaseUrl = "http://localhost:3001/users";

const client = axios.create({
  baseURL: "https://chat-app-api.up.railway.app/users",
});

export default client;
