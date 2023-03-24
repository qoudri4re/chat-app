import React, { useState, useEffect } from "react";
import "../auth.css";
import { Link, useNavigate } from "react-router-dom";
import { client } from "../../../utils/axios-request";
import {
  retrieveUserDetailsFromLocalStorage,
  setErrorAndFilter,
  saveUserDetailsToLocalStorage,
} from "../utils/functions";
import WaveLoading from "../../loaders/WaveLoading";

function Login() {
  let navigate = useNavigate();
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    setUserDetails(retrieveUserDetailsFromLocalStorage());
  }, []);

  useEffect(() => {
    if (userDetails) {
      navigate("/");
    }
  }, [navigate, userDetails]);

  const [formDetails, setFormDetails] = useState({
    username: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);
  const [loginStatus, setLoginStatus] = useState(false);
  const [displayLoaderAfterSubmiting, setDisplayLoadAfterSubmiting] =
    useState(false);

  //handle onchange event
  const handleChange = (e) => {
    setFormDetails({ ...formDetails, [e.target.name]: e.target.value });
  };

  //handle the submit event
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formDetails.username === "" || formDetails.password === "") {
      setErrorAndFilter("blank-field", "All fields must be filled!", setErrors);
    } else {
      setDisplayLoadAfterSubmiting(true);
      //if the error exist already in the errors array, removing it.
      //preventing error messages from displaying even after the user has corrected
      // the error
      setErrors((preVal) =>
        preVal.filter((item) => item.errorType !== "blank-field")
      );
      client
        .post("/login", {
          username: formDetails.username,
          password: formDetails.password,
        })
        .then((res) => {
          if ("error" in res.data) {
            //invalid login details
            setDisplayLoadAfterSubmiting(false);
            setErrorAndFilter("invalidDetails", res.data.error, setErrors);
          } else {
            setDisplayLoadAfterSubmiting(false);
            //save recieved details into local storage
            saveUserDetailsToLocalStorage(res.data, 3600000);
            setLoginStatus(true);
            setTimeout(() => navigate("/"), 1000);
          }
        })
        .catch((err) => console.log(err));
    }
  };
  if (!userDetails) {
    return (
      <div className="login form-container">
        <div className="left">
          <h2>Welcome to Chat App!</h2>
          <p>
            Login or sign up to start chatting with your friends, family, and
            colleagues. Stay connected and never miss a conversation. Join now!
          </p>
        </div>
        <div className="right">
          {loginStatus ? (
            <div className="msg success">
              <span>Login successful. Redirecting...</span>
            </div>
          ) : displayLoaderAfterSubmiting ? (
            <div className={"msg loader"}>
              <WaveLoading loadFor={"loading-for-auth"} />
            </div>
          ) : (
            <div
              className={
                "msg error" + (errors.length === 0 ? " hide-error-div" : "")
              }
            >
              {errors.map((item) => (
                <span key={item.id}>{item.errorMessage}</span>
              ))}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="username"
              value={formDetails.username}
              name="username"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="password"
              value={formDetails.password}
              name="password"
              onChange={handleChange}
            />
            <button disabled={loginStatus}>LOGIN</button>
            <span>
              Don't have an account? <Link to="/signup"> SIGNUP</Link>
            </span>
          </form>
        </div>
      </div>
    );
  }
}

export default Login;
