import axios from "axios";
//live urls
// 1- https://chat-app-api.up.railway.app/users fastest
// 2 - https://chat-app-api-ogbx.onrender.com/users slow

let baseURL;

if (process.env.REACT_APP_ENVIRONMENT === "development") {
  baseURL = "http://localhost:3001/users";
} else {
  baseURL = "https://chat-app-api.up.railway.app/users";
}

const client = axios.create({
  baseURL,
});

/**
 * header configuration for requests
 * @param {*} jwtToken
 * @returns header config
 */
function requestHeaderConfig(jwtToken) {
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  return config;
}

export { client, requestHeaderConfig };
