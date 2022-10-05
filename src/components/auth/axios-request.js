import axios from "axios";

const client = axios.create({
  baseURL: "https://chat-app-api-ogbx.onrender.com/users",
  // baseURL: "http://localhost:3001/users",
});

export default client;
